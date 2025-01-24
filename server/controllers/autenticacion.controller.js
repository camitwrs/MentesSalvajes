import dotenv from "dotenv";
dotenv.config();

import pool from "../pg.js"; // Asegúrate de que `pg` exporte su contenido usando `export default`
import bcrypt from "bcrypt";

import { crearTokenAcceso } from "../libs/jwt.js";

// Registrar un usuario
export const registrarUsuario = async (req, res, rol) => {
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
      `
      INSERT INTO usuarios (
        nombreusuario, 
        apellidousuario, 
        correousuario, 
        contrasenausuario, 
        fecharegistrousuario, 
        idrol
      ) 
      VALUES ($1, $2, $3, $4, TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'), $5)
      `,
      [nombre, apellido, email, hashedPassword, rol]
    );

    // Obtener el usuario recién creado
    const nuevoUsuario = resultado.rows[0];

    const token = await crearTokenAcceso({ id: nuevoUsuario.id });

    res.cookie("token", token);
    res.status(201).json({ mensaje: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el usuario." });
  }
};

// Loguear un usuario
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE correousuario = $1",
      [email]
    );
    if (usuario.rows.length === 0) {
      return res.status(400).json({ mensaje: "El usuario no existe." });
    }

    // Verificar la contraseña
    const usuarioEncontrado = usuario.rows[0];
    const esPasswordCorrecta = await bcrypt.compare(
      password,
      usuarioEncontrado.contrasenausuario
    );

    if (!esPasswordCorrecta) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }

    const token = await crearTokenAcceso({
      idusuario: usuarioEncontrado.idusuario,
    });

    res.cookie("token", token);
    res.status(200).json({ mensaje: "Inicio de sesión exitoso.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al iniciar sesión." });
  }
};

// Logout un usuario
export const logoutUsuario = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

// Obtener perfil
export const perfilUsuario = async (req, res) => {
  try {
    const { idusuario } = req.user;

    const result = await pool.query(
      `
      SELECT 
        u.nombreusuario, 
        u.apellidousuario, 
        u.correousuario, 
        u.fecharegistrousuario, 
        r.nombrerol
      FROM 
        usuarios u
      JOIN 
        roles r 
      ON 
        u.idrol = r.idrol
      WHERE 
        u.idusuario = $1
      `,
      [idusuario]
    );

    // Verificar si existe el usuario
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Retornar los datos del usuario
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
