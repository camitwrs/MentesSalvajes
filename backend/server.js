import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno
import routes from "./routes/export.js"; // Asegúrate de incluir la extensión .js
import path from "path";

import { fileURLToPath } from 'url'; // Necesario para __dirname en ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Permite solicitudes desde diferentes dominios
app.use(morgan("dev")); // Registro de solicitudes en la consola
app.use(express.json()); // Analiza las solicitudes JSON
app.use(express.urlencoded({ extended: false })); // Analiza solicitudes de formulario
app.use(cookieParser());

// Rutas principales
app.use("/api", routes);

// --- Servir React build ---
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Ruta por defecto para manejar errores de rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
