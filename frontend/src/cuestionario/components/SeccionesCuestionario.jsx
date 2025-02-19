const SeccionesCuestionario = () => {
  // Constantes para agrupar preguntas por secciones
  const a = [8, 9];
  const b = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  const c = [20, 21, 22, 23];
  const d = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];
  const e = [40, 41, 46, 51];
  const f = [40, 42, 47, 52];
  const g = [40, 43, 48, 53];
  const h = [40, 44, 49, 54];
  const i = [40, 45, 50, 55];
  const j = [56, 57, 58, 59, 60, 61, 62, 63, 64, 65];

  // Mapeo de secciones
  const secciones = {
    a: a,
    b: b,
    c: c,
    d: d,
    e: e,
    f: f,
    g: g,
    h: h,
    i: i,
    j: j,
  };

  return secciones; // Devuelve el objeto con las secciones
};

export default SeccionesCuestionario;
