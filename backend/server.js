import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv"; // Importa dotenv para cargar variables de entorno
import routes from "./routes/export.js"; // Asegúrate de incluir la extensión .js

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Permitido
      } else {
        console.log("Bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true, // Necesario para cookies
  })
);

app.use(morgan("dev")); // Registro de solicitudes en la consola
app.use(express.json()); // Analiza las solicitudes JSON
app.use(express.urlencoded({ extended: false })); // Analiza solicitudes de formulario
app.use(cookieParser());

// Rutas principales
app.use("/api", routes);

// Ruta por defecto para manejar errores de rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
