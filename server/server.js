const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config(); // Carga las variables de entorno desde el archivo .env

// Importar rutas
const routes = require("./routes/export");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
  })
); // por los dominios diferentes, politicas de navegador
app.use(morgan("dev")); // Registro de solicitudes en la consola
app.use(express.json()); // Analiza las solicitudes JSON
app.use(express.urlencoded({ extended: false })); // Analiza solicitudes de formulario

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
