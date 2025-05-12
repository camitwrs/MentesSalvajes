import pool from "../config/pg.js";

// Obtener todos los cuestionarios
export const getCuestionarios = async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.cuestionarios");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los cuestionarios:", error);
    res.status(500).json({ error: "Error al obtener los cuestionarios" });
  }
};

// Crear un nuevo cuestionario
export const crearCuestionario = async (req, res) => {
  const { titulocuestionario, descripcioncuestionario, estadocuestionario } =
    req.body;
  console.log(titulocuestionario, descripcioncuestionario, estadocuestionario);

  try {
    const query = `
      INSERT INTO cuestionarios (titulocuestionario, descripcioncuestionario, estadocuestionario)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [
      titulocuestionario,
      descripcioncuestionario,
      estadocuestionario,
    ];
    const result = await pool.query(query, values);
    return res.status(201).json({
      message: "Cuestionario creado exitosamente.",
      cuestionario: result.rows[0],
    });
  } catch (error) {
    console.error("Error al crear el cuestionario:", error);
    res.status(500).json({ error: "Error al crear el cuestionario" });
  }
};

// Obtener cuestionarios por título (búsqueda)
export const getCuestionariosPorTitulo = async (req, res) => {
  const { titulocuestionario } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM public.cuestionarios WHERE titulocuestionario ILIKE $1`,
      [`%${titulocuestionario}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al buscar cuestionarios:", error);
    res.status(500).json({ error: "Error al buscar cuestionarios" });
  }
};

export const getCuestionarioPorId = async (req, res) => {
  const { idcuestionario } = req.params;

  try {
    const query = `SELECT * FROM cuestionarios WHERE idcuestionario = $1`;
    const { rows } = await pool.query(query, [idcuestionario]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cuestionario no encontrado" });
    }

    res.json(rows[0]); 
  } catch (error) {
    console.error("Error al buscar el cuestionario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


export const getTotalCuestionarios = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(idcuestionario) AS total_cuestionarios FROM cuestionarios"
    );
    res.json({ total_cuestionarios: result.rows[0].total_cuestionarios });
  } catch (error) {
    console.error(
      "Error al obtener la cantidad de cuestionarios:",
      error
    );
    res.status(500).json({
      error: "Error al obtener la cantidad de cuestionarios",
    });
  }
};

export const getDiferenciaCuestionarios = async (_, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) AS diferencia_cuestionarios FROM cuestionarios WHERE fechacreacioncuestionario >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'"
    );
    res.json({
      diferencia_cuestionarios: result.rows[0].diferencia_cuestionarios,
    });
  } catch (error) {
    console.error("Error al obtener la diferencia de cuestionarios:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la diferencia de cuestionarios" });
  }
};

export const actualizarCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;
  const { titulocuestionario, estadocuestionario, descripcioncuestionario } = req.body;

  try {
    // Validar que se haya enviado el ID
    if (!idcuestionario) {
      return res.status(400).json({
        error: "El parámetro idcuestionario es requerido.",
      });
    }

    // Construir dinámicamente la consulta SQL
    const fields = [];
    const values = [];
    let index = 1;

    if (titulocuestionario) {
      fields.push(`titulocuestionario = $${index}`);
      values.push(titulocuestionario);
      index++;
    }

    if (estadocuestionario) {
      fields.push(`estadocuestionario = $${index}`);
      values.push(estadocuestionario);
      index++;
    }

    if (descripcioncuestionario) {
      fields.push(`descripcioncuestionario = $${index}`);
      values.push(descripcioncuestionario);
      index++;
    }

    values.push(idcuestionario); // Agregar el ID como último parámetro

    // Si no hay campos para actualizar, devolver un error
    if (fields.length === 0) {
      return res.status(400).json({
        error: "Debe enviar al menos un campo para actualizar.",
      });
    }

    const query = `
      UPDATE cuestionarios
      SET ${fields.join(", ")}
      WHERE idcuestionario = $${index}
      RETURNING *;
    `;

    // Ejecutar la consulta
    const result = await pool.query(query, values);

    // Verificar si se actualizó algún registro
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Cuestionario no encontrado.",
      });
    }

    // Responder con el cuestionario actualizado
    return res.status(200).json({
      message: "Cuestionario actualizado exitosamente.",
      cuestionario: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar el cuestionario:", error);
    return res.status(500).json({
      error: "Ocurrió un error al actualizar el cuestionario.",
    });
  }
};

// Controlador para eliminar un cuestionario
export const eliminarCuestionario = async (req, res) => {
  const { idcuestionario } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM cuestionarios WHERE idcuestionario = $1 RETURNING *",
      [idcuestionario]
    );

    // Verifica si se eliminó alguna fila
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cuestionario no encontrado." });
    }

    // Responde con éxito (usualmente 204 No Content o 200 OK)
    return res.status(204).send(); // 204 es común para DELETE exitoso sin contenido de respuesta
    // Opcionalmente: return res.status(200).json({ message: 'Cuestionario eliminado exitosamente.' });
  } catch (error) {
    console.error("Error al eliminar el cuestionario:", error);
    return res.status(500).json({
      error: "Error interno del servidor al eliminar el cuestionario",
    });
  }
};
