import pool from "../config/pg.js";
import supabase from "../config/supabaseClient.js";

// Guardar primera parte de la ilustracion desde el cuestionario
export const guardarMensaje = async (req, res) => {
  const { tituloilustracion, descripcionilustracion, ideducador, idrespuesta, urlarchivoilustracion } = req.body;

  try {

    await pool.query('BEGIN'); // Inicia transacción

    // 1. Insertar la ilustración
    const insertQuery = `
      INSERT INTO ilustraciones (tituloilustracion, descripcionilustracion, ideducador, urlarchivoilustracion)
      VALUES ($1, $2, $3, $4) RETURNING idilustracion;
    `;
    const insertValues = [tituloilustracion, descripcionilustracion, ideducador, urlarchivoilustracion];
    const insertResult = await pool.query(insertQuery, insertValues);

    const idilustracion = insertResult.rows[0].idilustracion;

    // 2. Asociar la ilustración con la respuesta correspondiente
    const updateQuery = `
      UPDATE respuestas
      SET idilustracion = $1
      WHERE idrespuesta = $2;
    `;
    await pool.query(updateQuery, [idilustracion, idrespuesta]);

    await pool.query('COMMIT'); // Confirmar transacción

    res.status(201).json({
      message: "Ilustración guardada y asociada correctamente.",
    });
  } catch (error) {
     await pool.query('ROLLBACK');
    console.error("Error al guardar la ilustración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Guardar segunda parte de la ilustracion desde el disenador
export const guardarArchivo = async (req, res) => {
  const { idilustracion } = req.body;
  const archivoilustracion = req.file; // Multer sube el archivoilustracion aquí

  if (!archivoilustracion) {
    return res
      .status(400)
      .json({ error: "No se proporcionó ningún archivoilustracion" });
  }

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 1) Limpiar el nombre del archivo
    const originalName = archivoilustracion.originalname;
    const cleanedName = originalName
      .normalize("NFD") // Normalizar caracteres Unicode
      .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos
      .replace(/[^a-zA-Z0-9._-]/g, "_"); // Reemplazar caracteres no válidos con "_"

    const filePath = `${Date.now()}_${cleanedName}`;

    // 2) Subir archivoilustracion a Supabase Storage
    const { data, error } = await supabase.storage
      .from("ilustraciones")
      .upload(filePath, archivoilustracion.buffer, {
        contentType: archivoilustracion.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Error al subir a Supabase:", error);
      await pool.query("ROLLBACK");
      return res
        .status(500)
        .json({ error: "Error subiendo archivoilustracion a storage" });
    }

    // 3) Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("ilustraciones")
      .getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      console.error("Error al obtener la URL pública");
      await pool.query("ROLLBACK");
      return res.status(500).json({
        error: "Error obteniendo la URL pública",
      });
    }

    // 4) Guardar URL en Postgres
    const query = `
      UPDATE ilustraciones 
      SET urlarchivoilustracion = $1, fechacargailustracion = CURRENT_TIMESTAMP, estadoilustracion = 'completado'
      WHERE idilustracion = $2 RETURNING *;
    `;

    const values = [publicUrl, idilustracion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "Ilustración no encontrada" });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json({
      mensaje: "Archivo subido con éxito",
      ilustracion: rows[0],
      url: publicUrl,
    });
  } catch (error) {
    console.error("Error al guardar la URL:", error);
    await pool.query("ROLLBACK");
    res.status(500).json({ error: "Error interno del servidor" });
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
    console.error("Error al obtener los mensajes:", error);
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

    if (respuestaResult.rows.length === 0 || !respuestaResult.rows[0].idilustracion) {
      return res.status(404).json({ error: "No se encontró una ilustración asociada a la respuesta." });
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
      idilustracion
    });

  } catch (error) {
    console.error("Error al obtener la info de la ilustración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
