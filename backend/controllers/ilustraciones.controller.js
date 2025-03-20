import pool from "../pg.js";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Guardar primera parte de la ilustracion desde el cuestionario
export const guardarMensaje = async (req, res) => {
  const { tituloilustracion, descripcionllustracion, ideducador } = req.body;

  try {
    const query = `
      INSERT INTO ilustraciones (titulollustracion, descripcionllustracion, ideducador)
      VALUES ($1, $2, $3) RETURNING *;
    `;

    const values = [tituloilustracion, descripcionllustracion, ideducador];
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      mensaje: "Ilustración guardada con éxito",
      ilustracion: rows[0],
    });
  } catch (error) {
    console.error("Error al guardar la ilustración:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Guardar segunda parte de la ilustracion desde el disenador
export const guardarArchivo = async (req, res) => {
  const { iddisenador, idilustracion } = req.body;
  const archivo = req.file; // Multer sube el archivo aquí

  if (!archivo) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo" });
  }

  try {
    // 1) Subir archivo a Supabase Storage
    const filePath = `imagenes/${Date.now()}_${archivo.originalname}`;
    const { data, error } = await supabase.storage
      .from("ilustraciones")
      .upload(filePath, archivo.buffer, {
        contentType: archivo.mimetype,
        upsert: true,
      });

    if (error) {
      console.error("Error al subir a Supabase:", error);
      return res
        .status(500)
        .json({ error: "Error subiendo archivo a storage" });
    }

    // 2) Obtener URL pública
    const { publicUrl } = supabase.storage
      .from("ilustraciones")
      .getPublicUrl(filePath);

    // 3) Guardar URL en Postgres
    const query = `
      UPDATE ilustraciones 
      SET urlarchivoilustracion = $1, fechacargailustracion = CURRENT_TIMESTAMP, estadoilustracion = 'completado', iddisenador = $2
      WHERE idilustracion = $3 RETURNING *;
    `;

    const values = [publicUrl, iddisenador, idilustracion];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Ilustración no encontrada" });
    }

    res.status(200).json({
      mensaje: "Archivo subido con éxito",
      ilustracion: rows[0],
      url: publicUrl,
    });
  } catch (error) {
    console.error("Error al guardar la URL:", error);
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
