import PropTypes from "prop-types";
import { useEffect } from "react";

const PreguntaRange = ({ idPregunta, opciones, userData, setUserData }) => {
  // Selección inicial por defecto
  useEffect(() => {
    if (!userData[idPregunta] && opciones.length > 0) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [idPregunta]: opciones[0].idalternativa, // Seleccionar automáticamente la primera opción
      }));
    }
  }, [idPregunta, opciones, userData, setUserData]);

  const handleRangeChange = (e) => {
    const selectedIndex = parseInt(e.target.value, 10); // Convertir el valor del rango a número
    const selectedAlternativa = opciones[selectedIndex]; // Obtener la opción seleccionada

    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: selectedAlternativa
        ? selectedAlternativa.idalternativa
        : null, // Guardar la idAlternativa seleccionada
    }));
  };

  // Determinar la opción seleccionada actualmente
  const selectedId = userData[idPregunta];
  const selectedIndex = opciones.findIndex(
    (opcion) => opcion.idalternativa === selectedId
  );

  // Ordenar las opciones antes de usarlas
  const opcionesOrdenadas = [...opciones].sort((a, b) => a.idalternativa - b.idalternativa);

  return (
    <div className="w-full">
      {/* Control deslizante */}
      <input
        type="range"
        min="0"
        max={opcionesOrdenadas.length - 1}
        step="1"
        value={selectedIndex !== -1 ? selectedIndex : 0}
        onChange={handleRangeChange}
        className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
      />

      {/* Mostrar opción seleccionada solo en pantallas pequeñas */}
      <div className="block sm:hidden mt-2 text-center text-sm text-gray-600">
        {opcionesOrdenadas[selectedIndex]?.textoalternativa}
      </div>

      {/* Mostrar todas las opciones en pantallas medianas o más grandes */}
      <div
        className="hidden sm:grid sm:grid-cols-5 gap-2 mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 w-full px-2"
        style={{ gridTemplateColumns: `repeat(${opcionesOrdenadas.length}, 1fr)` }}
      >
        {opcionesOrdenadas.map((opcion) => (
          <span
            key={opcion.idalternativa}
            className="text-center p-2 break-words"
          >
            {opcion.textoalternativa}
          </span>
        ))}
      </div>
    </div>
  );
};

PreguntaRange.propTypes = {
  idPregunta: PropTypes.number.isRequired,
  opciones: PropTypes.arrayOf(
    PropTypes.shape({
      idalternativa: PropTypes.number.isRequired,
      textoalternativa: PropTypes.string.isRequired,
    })
  ).isRequired,
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
};

export default PreguntaRange;
