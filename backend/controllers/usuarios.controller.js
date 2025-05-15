import pool from "../config/pg.js";

export const getDatosEducador = async (req, res) => {
  const { idusuario } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT e.*, u.nombreusuario, u.apellidousuario 
      FROM educadores e 
      JOIN usuarios u ON e.ideducador = u.idusuario 
      WHERE u.idusuario = $1;`,
      [idusuario]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron datos para el educador." });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en getDatosEducador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarDatosEducador = async (req, res) => {
  const { idusuario } = req.params; // Obtener el idusuario de los parámetros
  const {
    edadeducador,
    sexoeducador,
    paiseducador,
    intereseseducador,
    tituloprofesionaleducador,
    anosexperienciaeducador
  } = req.body; // Obtener los campos del cuerpo de la solicitud

  try {
    await pool.query("BEGIN"); // Iniciar transacción

    // 🔹 Actualizar la tabla educadores
    const educadorResult = await pool.query(
      `UPDATE educadores
       SET edadeducador = $1,
           sexoeducador = $2,
           paiseducador = $3,
           intereseseducador = $4,
           tituloprofesionaleducador = $5,
           anosexperienciaeducador = $6
       WHERE ideducador = $7`,
      [
        edadeducador,
        sexoeducador,
        paiseducador,
        intereseseducador,
        tituloprofesionaleducador,
        anosexperienciaeducador,
        idusuario
      ]
    );

    if (educadorResult.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "No se encontró el educador con el id proporcionado." });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json({
      message: "Educador actualizado correctamente."
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir transacción en caso de error
    console.error("Error al actualizar educador:", error);
    res.status(500).json({
      error: "Error al actualizar educador.",
      details: error.message
    });
  }
};

export const actualizarDatosUsuario = async (req, res) => {
  const { idusuario } = req.params; // Obtener el idusuario de los parámetros
  const {
    correousuario,
    nombreusuario,
    apellidousuario
  } = req.body; // Obtener los campos del cuerpo de la solicitud

  try {
    await pool.query("BEGIN"); // Iniciar transacción

// 🔹 Actualizar la tabla usuarios
    const usuarioResult = await pool.query(
      `UPDATE usuarios
       SET nombreusuario = $1,
           apellidousuario = $2,
           correousuario = $3
       WHERE idusuario = $4`,
      [nombreusuario, apellidousuario, correousuario, idusuario]
    );

    if (usuarioResult.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "No se encontró el usuario con el id proporcionado." });
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json({
      message: "Usuario actualizados correctamente."
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir transacción en caso de error
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      error: "Error al actualizar usuario.",
      details: error.message
    });
  }
};

export const getEducadores = async (_, res) => {
  try {
    const query = `
      SELECT * FROM usuarios
      WHERE idrol = 1;
    `;

    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios educadores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTotalEducadores = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(ideducador) AS total_educadores FROM educadores"
    );
    res.json({ total_educadores: result.rows[0].total_educadores });
  } catch (error) {
    console.error("Error al obtener la cantidad de educadores:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la cantidad de educadores" });
  }
};

export const getDiferenciaEducadores = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS diferencia_educadores FROM usuarios WHERE idrol = 1 AND fecharegistrousuario >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'"
    );
    res.json({ diferencia_educadores: result.rows[0].diferencia_educadores });
  } catch (error) {
    console.error("Error al obtener la diferencia de educadores:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la diferencia de educadores" });
  }
};
