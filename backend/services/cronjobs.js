import { pool } from "../config/database.js"; // Conexión a Postgres
import supabase from "../config/supabaseClient.js"; // Cliente de Supabase

const verificarArchivosSupabase = async () => {
  console.log("⏳ Verificando archivos en Supabase...");

  try {
    // Obtener todas las ilustraciones con URL en la base de datos
    const { rows } = await pool.query(
      "SELECT idilustracion, urlarchivoilustracion FROM ilustraciones WHERE urlarchivoilustracion IS NOT NULL"
    );

    for (const ilustracion of rows) {
      const filePath = ilustracion.urlarchivoilustracion.split("/storage/v1/object/public/ilustraciones/")[1];

      // Verificar si el archivo existe en Supabase Storage
      const { data, error } = await supabase.storage.from("ilustraciones").list();

      if (error || !data.some(file => file.name === filePath)) {
        // Si el archivo no existe en Supabase, eliminar la URL de la base de datos
        await pool.query(
          "UPDATE ilustraciones SET urlarchivoilustracion = NULL WHERE idilustracion = $1",
          [ilustracion.idilustracion]
        );
        console.log(`🚨 URL eliminada para ilustración ID ${ilustracion.idilustracion}`);
      }
    }
  } catch (error) {
    console.error("❌ Error verificando archivos en Supabase:", error);
  }
};

// Ejecutar cada 10 minutos
setInterval(verificarArchivosSupabase, 10 * 60 * 1000);

export default verificarArchivosSupabase;
