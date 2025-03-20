import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.SUPABASE_USER,
  host: process.env.SUPABASE_HOST,
  database: process.env.SUPABASE_DATABASE,
  password: process.env.SUPABASE_PASSWORD,
  port: process.env.SUPABASE_PORT,
  ssl: { rejectUnauthorized: false }, // Importante para Supabase
});

// Test conexión
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a la BD:", err.message);
  } else {
    console.log("✅ Conexión exitosa a Supabase:", res.rows[0]);
  }
});

pool.on("connect", () => {
  console.log("Conexión exitosa a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Error en la conexión a la base de datos:", err.message);
});

export default pool;
