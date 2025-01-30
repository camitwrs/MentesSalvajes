export const handleNextSeccion = (seccionActual, setSeccionActual, nombresSecciones) => {
  const indexActual = nombresSecciones.indexOf(seccionActual);
  if (indexActual < nombresSecciones.length - 1) {
    setSeccionActual(nombresSecciones[indexActual + 1]);

    // Desplazar al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
};

export const handlePrevSeccion = (seccionActual, setSeccionActual, nombresSecciones) => {
  const indexActual = nombresSecciones.indexOf(seccionActual);
  if (indexActual > 0) {
    setSeccionActual(nombresSecciones[indexActual - 1]);

    // Desplazar al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
};