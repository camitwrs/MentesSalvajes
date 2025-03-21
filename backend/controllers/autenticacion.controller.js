import pool from "../pg.js"; // Asegúrate de que `pg` exporte su contenido usando `export default`
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { crearTokenAcceso } from "../libs/jwt.js";

// Registrar un educador
export const registrarEducador = async (req, res) => {
  const {
    nombreusuario,
    apellidousuario,
    correousuario,
    contrasenausuario,
    tituloprofesionaleducador,
    intereseseducador,
    paiseducador,
    edadeducador,
    institucioneducador,
    sexoeducador,
    anosexperienciaeducador,
  } = req.body;

  const idrol = 1;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correousuario = $1",
      [correousuario]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json(["El usuario ya existe"]);
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenausuario, salt);

    // Insertar el educador en la tabla usuarios
    const usuarioResult = await pool.query(
      `
      INSERT INTO usuarios (
        nombreusuario, 
        apellidousuario, 
        correousuario, 
        contrasenausuario,
        idrol
      ) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING idusuario, nombreusuario, apellidousuario, correousuario, idrol
      `,
      [nombreusuario, apellidousuario, correousuario, hashedPassword, idrol]
    );

    // Obtener el id de usuario recién creado
    const idUsuarioResult = usuarioResult.rows[0].idusuario;

    // Insertar al usuario en la tabla educadores
    await pool.query(
      `
      INSERT INTO educadores (
        ideducador, 
        tituloprofesionaleducador, 
        intereseseducador, 
        paiseducador, 
        edadeducador, 
        institucioneducador, 
        sexoeducador, 
        anosexperienciaeducador
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        idUsuarioResult,
        tituloprofesionaleducador,
        intereseseducador,
        paiseducador,
        edadeducador,
        institucioneducador,
        sexoeducador,
        anosexperienciaeducador,
      ]
    );

    const userSaved = usuarioResult.rows[0];

    return res.json({
      idusuario: idUsuarioResult,
      nombreusuario: userSaved.nombreusuario,
      apellidousuario: userSaved.apellidousuario,
      correousuario: userSaved.correousuario,
      idrol: userSaved.idrol,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(["Error al registrar el usuario y educador."]);
  }
};

// Registrar Admin o Ilustrador o Revisor
export const registrarUsuario = async (req, res) => {
  const {
    nombreusuario,
    apellidousuario,
    correousuario,
    contrasenausuario,
    idrol,
  } = req.body;

  try {
    // Verificar si el admin ya existe
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correousuario = $1",
      [correousuario]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json(["El usuario ya existe"]);
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenausuario, salt);

    // Insertar el admin en la tabla usuarios
    const usuarioResult = await pool.query(
      `
      INSERT INTO usuarios (
        nombreusuario, 
        apellidousuario, 
        correousuario, 
        contrasenausuario,
        idrol
      ) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING idusuario, nombreusuario, apellidousuario, correousuario, idrol
      `,
      [nombreusuario, apellidousuario, correousuario, hashedPassword, idrol]
    );

    const userSaved = usuarioResult.rows[0];
    console.log(userSaved);
    const token = await crearTokenAcceso({ idusuario: userSaved.idusuario });

    res.cookie("token", token, {
      httpOnly: true, // No accesible por JS
      secure: true, // Solo por HTTPS (Render usa HTTPS)
      domain: ".onrender.com",
      sameSite: "None", // Necesario para cross-origin
      maxAge: 1000 * 60 * 60 * 24, // Tiempo que persiste
    });

    return res.json({
      idusuario: userSaved.idusuario,
      nombreusuario: userSaved.nombreusuario,
      apellidousuario: userSaved.apellidousuario,
      correousuario: userSaved.correousuario,
      idrol: userSaved.idrol,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(["Error al registrar el usuario."]);
  }
};

// Loguear un usuario
export const loginUsuario = async (req, res) => {
  const { correousuario, contrasenausuario } = req.body;

  try {
    // Verificar si el usuario existe
    const usuarioResult = await pool.query(
      "SELECT * FROM usuarios WHERE correousuario = $1",
      [correousuario]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(400).json(["El usuario no existe."]);
    }

    // Verificar la contraseña
    const usuarioEncontrado = usuarioResult.rows[0];
    const esPasswordCorrecta = await bcrypt.compare(
      contrasenausuario,
      usuarioEncontrado.contrasenausuario
    );

    if (!esPasswordCorrecta) {
      return res.status(401).json(["Contraseña incorrecta."]);
    }

    const token = await crearTokenAcceso({
      idusuario: usuarioEncontrado.idusuario,
    });

    res.cookie("token", token, {
      httpOnly: true, // No accesible por JS
      secure: true, // Solo por HTTPS (Render usa HTTPS)
      domain: ".onrender.com",
      sameSite: "None", // Necesario para cross-origin
      maxAge: 1000 * 60 * 60 * 24, // Tiempo que persiste
    });
    //res.status(200).json({ mensaje: "Inicio de sesión exitoso.", token });

    return res.json({
      idusuario: usuarioEncontrado.idusuario,
      nombreusuario: usuarioEncontrado.nombreusuario,
      apellidousuario: usuarioEncontrado.apellidousuario,
      correousuario: usuarioEncontrado.correousuario,
      idrol: usuarioEncontrado.idrol,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(["Error al iniciar sesión."]);
  }
};

// Logout un usuario
export const logoutUsuario = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    domain: ".onrender.com",
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
      return res.status(404).json(["Usuario no encontrado"]);
    }

    // Retornar los datos del usuario
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return res.status(500).json(["Error interno del servidor"]);
  }
};

// Verificar token
export const verificarToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token)
    return res.status(401).json({ message: "No autorizado, no hay token" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err)
      return res.status(401).json({ message: "No autorizado, hay error" });

    const usuarioResult = await pool.query(
      "SELECT * FROM usuarios WHERE idusuario = $1",
      [user.idusuario]
    );

    if (usuarioResult.rows.length === 0) {
      return res.status(401).json({ message: "No autorizado, no hay usuario" });
    }

    return res.json({
      idusuario: usuarioResult.rows[0].idusuario,
      nombreusuario: usuarioResult.rows[0].nombreusuario,
      apellidousuario: usuarioResult.rows[0].apellidousuario,
      correousuario: usuarioResult.rows[0].correousuario,
      idrol: usuarioResult.rows[0].idrol,
    });
  });
};
