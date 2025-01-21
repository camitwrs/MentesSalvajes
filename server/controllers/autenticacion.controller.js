require("dotenv").config();

const pool = require("../pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrar un usuario
const registrarUsuario = async (req, res, rol) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correousuario = $1",
      [email]
    );
    if (usuarioExistente.rows.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "El usuario ya está registrado." });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO usuarios (nombreusuario, apellidousuario, correousuario, contrasenausuario, fecharegistrousuario, idrol) VALUES ($1, $2, $3, $4, NOW(), $5)",
      [nombre, apellido, email, hashedPassword, rol]
    );

    console.log("contraseña hasheada:", hashedPassword);

    res.status(201).json({ mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el usuario." });
  }
};

// Loguear un usuario
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );
    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensaje: "El usuario no existe." });
    }

    // Verificar la contraseña
    const usuarioData = usuario.rows[0];
    const esPasswordCorrecta = await bcrypt.compare(
      password,
      usuarioData.password
    );
    if (!esPasswordCorrecta) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: usuarioData.id, email: usuarioData.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Token generado:", token);

    res.status(200).json({ mensaje: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesión." });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
};
