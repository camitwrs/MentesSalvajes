import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }, // Importante para Supabase
});

// Test conexión
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a la BD:", err.message);
  } else {
    console.log("✅ Conexión exitosa a Railway:", res.rows[0]);
  }
});

pool.on("connect", () => {
  console.log("Conexión exitosa a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Error en la conexión a la base de datos:", err.message);
});

export default pool;
