import pool from "../config/pg.js";
//import supabase from "../config/supabaseClient.js"; // Lo mantenemos por si lo usas en otros lugares
import { v4 as uuidv4 } from 'uuid'; // Necesitas esta importación para generar nombres únicos
import { uploadFileToR2, deleteFileFromR2 } from '../services/r2.js'; // <-- Importa tus funciones de R2

// Guardar primera parte de la ilustracion desde el cuestionario
export const guardarMensaje = async (req, res) => {
  const {
    tituloilustracion,
    descripcionilustracion,
    ideducador,
    idrespuesta,
    urlarchivoilustracion, // Esto podría ser un valor temporal o nulo inicialmente
  } = req.body;
  console.log(
    "datos",
    tituloilustracion,
    descripcionilustracion,
    ideducador,
    idrespuesta,
    urlarchivoilustracion
  );
  try {
    await pool.query("BEGIN"); // Inicia transacción

    // 1. Insertar la ilustración (urlarchivoilustracion puede ser nulo o vacío al principio)
    const insertQuery = `
      INSERT INTO ilustraciones (tituloilustracion, descripcionilustracion, ideducador, urlarchivoilustracion)
      VALUES ($1, $2, $3, $4) RETURNING idilustracion;
    `;
    // Asegúrate de que urlarchivoilustracion se guarda inicialmente como NULL o cadena vacía
    // si la imagen se sube en un paso posterior. Si el flujo es que se pasa una URL dummy
    // y luego se actualiza, está bien como lo tienes.
    const insertValues = [
      tituloilustracion,
      descripcionilustracion,
      ideducador,
      urlarchivoilustracion || null, // Asegurarse de que sea null si no se proporciona
    ];
    const insertResult = await pool.query(insertQuery, insertValues);

    const idilustracion = insertResult.rows[0].idilustracion;

    // 2. Asociar la ilustración con la respuesta correspondiente
    const updateQuery = `
      UPDATE respuestas
      SET idilustracion = $1
      WHERE idrespuesta = $2;
    `;
    await pool.query(updateQuery, [idilustracion, idrespuesta]);

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(201).json({
      message: "Ilustración guardada y asociada correctamente.",
      idilustracion: idilustracion // Es muy útil devolver el ID para el segundo paso (guardarArchivo)
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al guardar la ilustración (guardarMensaje):", error);
    res.status(500).json({ error: "Error interno del servidor al guardar mensaje" });
  }
};

// Guardar segunda parte de la ilustracion desde el disenador (AHORA CON R2)
export const guardarArchivo = async (req, res) => {
  // idilustracion viene del cuerpo de la solicitud POST
  const { idilustracion } = req.body;
  // archivoilustracion es el archivo procesado por Multer
  const archivoilustracion = req.file;

  if (!idilustracion) {
    return res.status(400).json({ error: "Se requiere 'idilustracion' para guardar el archivo." });
  }

  if (!archivoilustracion) {
    return res
      .status(400)
      .json({ error: "No se proporcionó ningún archivo de ilustración." });
  }

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 1) Generar un nombre de archivo único para R2
    // Usaremos UUID para asegurar unicidad y mantener la extensión original
    const originalExtension = archivoilustracion.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${originalExtension}`;

    // 2) Subir el archivo a Cloudflare R2
    // Utilizamos el buffer del archivo y su mimetype directamente
    const publicUrl = await uploadFileToR2(
      archivoilustracion.buffer,
      uniqueFileName,
      archivoilustracion.mimetype
    );

    // 3) Guardar URL y el nombre único (key) en Postgres
    // Es buena práctica guardar el 'uniqueFileName' también, por si necesitas eliminarlo de R2 después
    // Si tu tabla `ilustraciones` no tiene una columna para el `key` de R2, puedes añadirla.
    // Por ahora, solo actualizaremos `urlarchivoilustracion`.
    const query = `
      UPDATE ilustraciones
      SET urlarchivoilustracion = $1, fechacargailustracion = CURRENT_TIMESTAMP, estadoilustracion = 'completado'
      WHERE idilustracion = $2 RETURNING *;
    `;

    const values = [publicUrl, idilustracion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      await pool.query("ROLLBACK");
      // Opcional: Si la ilustración no se encuentra, considera eliminar el archivo recién subido de R2
      // await deleteFileFromR2(uniqueFileName);
      return res.status(404).json({ error: "Ilustración no encontrada para actualizar." });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json({
      message: "Archivo subido a R2 y URL guardada con éxito.",
      ilustracion: rows[0],
      url: publicUrl,
      fileName: uniqueFileName, // También puedes devolver el nombre único si el frontend lo necesita
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // En caso de cualquier error, rollback la transacción de la DB
    console.error("Error al guardar archivoilustracion con R2:", error);
    // Un manejo de error más específico para el cliente
    let statusCode = 500;
    let errorMessage = "Error interno del servidor al procesar la ilustración.";

    if (error.message.includes("Fallo al subir el archivo")) {
      statusCode = 502; // Bad Gateway - Error en la comunicación con el servicio externo (R2)
      errorMessage = `Error al subir el archivo: ${error.message}`;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getAllIlustraciones = async (req, res) => {
  try {
    const query = `
      SELECT * FROM ilustraciones
      ORDER BY idilustracion DESC;
    `;
    const { rows } = await pool.query(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener las ilustraciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getIlustracionPorRespuesta = async (req, res) => {
  const { idrespuesta } = req.params;

  try {
    // 1. Obtener idilustracion desde la tabla respuestas
    const respuestaResult = await pool.query(
      `SELECT idilustracion FROM respuestas WHERE idrespuesta = $1`,
      [idrespuesta]
    );

    if (
      respuestaResult.rows.length === 0 ||
      !respuestaResult.rows[0].idilustracion
    ) {
      return res
        .status(404)
        .json({
          error: "No se encontró una ilustración asociada a la respuesta.",
        });
    }

    const idilustracion = respuestaResult.rows[0].idilustracion;

    // 2. Obtener la información de la ilustración
    const ilustracionResult = await pool.query(
      `SELECT urlarchivoilustracion, descripcionilustracion FROM ilustraciones WHERE idilustracion = $1`,
      [idilustracion]
    );

    if (ilustracionResult.rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la ilustración." });
    }

    const ilustracion = ilustracionResult.rows[0];

    res.status(200).json({
      urlarchivoilustracion: ilustracion.urlarchivoilustracion,
      descripcionilustracion: ilustracion.descripcionilustracion,
      idilustracion,
    });
  } catch (error) {
    console.error("Error al obtener la info de la ilustración por respuesta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};