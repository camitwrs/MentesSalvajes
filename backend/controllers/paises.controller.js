import pool from "../config/pg.js";

export const getPaises = async (_, res) => {
  try {
    const paisesQuery = `
      SELECT idpais, nombrepais
      FROM paises
      ORDER BY nombrepais ASC;
    `;

    // 2. Ejecutar la consulta
    const paisesResult = await pool.query(paisesQuery);
    console.log(paisesResult.rows);
    res.status(200).json(paisesResult.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error interno del servidor al obtener paises.",
    });
  }
};
