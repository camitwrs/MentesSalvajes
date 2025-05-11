const SeccionesCuestionario = () => {
  // Constantes para agrupar preguntas por secciones
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const b = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
  const c = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39];

  // Mapeo de secciones
  const secciones = {
    a: a,
    b: b,
    c: c,
  };

  return secciones; // Devuelve el objeto con las secciones
};

export default SeccionesCuestionario;
