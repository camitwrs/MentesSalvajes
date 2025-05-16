import pool from "../config/pg.js";

export const getUniversidadesPorPais = async (req, res) => {
  const { nombrepais } = req.params;

  if (!nombrepais) {
    return res
      .status(400)
      .json({ message: "El parámetro 'nombrepais' es requerido." });
  }

  try {
    const paisQuery = `
      SELECT idpais
      FROM paises
      WHERE LOWER(nombrepais) = LOWER($1);
    `;
    const paisResult = await pool.query(paisQuery, [nombrepais.trim()]);

    if (paisResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `País no encontrado: ${nombrepais}` });
    }

    const idPais = paisResult.rows[0].idpais;

    const universidadesQuery = `
      SELECT nombreuniversidad, iduniversidad, idpais
      FROM universidades
      WHERE idpais = $1
      ORDER BY nombreuniversidad ASC;
    `;

    const universidadesResult = await pool.query(universidadesQuery, [idPais]);

    res.status(200).json(universidadesResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error interno del servidor al obtener universidades.",
    });
  }
};
