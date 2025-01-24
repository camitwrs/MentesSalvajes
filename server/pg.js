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
});

// Probar conexión
pool.query("SELECT 1");

pool.on("connect", () => {
  console.log("Conexión exitosa a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Error en la conexión a la base de datos:", err.message);
});

export default pool;
