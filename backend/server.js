import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv"; // Importa dotenv
import routes from "./routes/export.js"; // Tus rutas principales
// import imageRoutes from "./routes/imageRoutes.js"; // Ya no lo usaremos separado, integrará en ilustraciones.routes.js

dotenv.config(); // <-- ¡Esta línea debe ser la primera después de las importaciones!

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rutas principales
app.use("/api", routes);

// NO NECESITAS app.use("/api/images", imageRoutes); AQUÍ
// Porque lo gestionaremos directamente en ilustraciones.routes.js

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});