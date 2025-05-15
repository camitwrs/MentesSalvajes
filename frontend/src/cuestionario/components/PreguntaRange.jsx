import PropTypes from "prop-types";
import { useEffect } from "react";

const PreguntaRange = ({ idPregunta, opciones, userData, setUserData }) => {
  // Ordenar opciones antes de usarlas
  const opcionesOrdenadas = [...opciones].sort(
    (a, b) => a.idalternativa - b.idalternativa
  );

  useEffect(() => {
    if (!userData[idPregunta] && opcionesOrdenadas.length > 0) {
      setUserData((prevUserData) => {
        const updatedUserData = { ...prevUserData };
        return updatedUserData;
      });
    }
  }, [idPregunta, opcionesOrdenadas, userData, setUserData]);

  const handleRangeChange = (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const selectedAlternativa = opcionesOrdenadas[selectedIndex];

    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: selectedAlternativa
        ? selectedAlternativa.idalternativa
        : null,
    }));
  };

  // Obtener el ID seleccionado
  const selectedId = userData[idPregunta];

  // Buscar el índice en opcionesOrdenadas
  const selectedIndex = opcionesOrdenadas.findIndex(
    (opcion) => opcion.idalternativa === selectedId
  );

  return (
    <div className="w-full">
      {/* Slider */}
      <input
        type="range"
        min="0"
        max={opcionesOrdenadas.length - 1}
        step="1"
        value={selectedIndex !== -1 ? selectedIndex : 0}
        onChange={handleRangeChange}
        className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-transform duration-200 ease-in-out
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gray-700
          [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:bg-gray-100"
      />

      {/* Texto para móviles (debajo del slider) */}
      <div className="block sm:hidden mt-2 text-center text-sm text-gray-600">
        {opcionesOrdenadas[selectedIndex]?.textoalternativa}
      </div>

      {/* Etiquetas alineadas debajo */}
      <div
        className="grid mt-4 text-sm text-gray-600 w-full"
        style={{
          gridTemplateColumns: `repeat(${opcionesOrdenadas.length}, 1fr)`,
        }}
      >
        {opcionesOrdenadas.map((opcion) => {
          const isSelected = opcion.idalternativa === selectedId;
          return (
            <div
              key={opcion.idalternativa}
              className={`text-center px-1 break-words ${
                isSelected ? "text-black font-semibold" : ""
              }`}
            >
              {opcion.textoalternativa}
            </div>
          );
        })}
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
