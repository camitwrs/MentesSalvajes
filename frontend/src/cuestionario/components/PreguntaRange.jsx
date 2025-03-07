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

        // Verificar si la pregunta 56 tiene seleccionada la alternativa 154
        if (prevUserData[56] === 154) {
          delete updatedUserData[60];
          delete updatedUserData[61];
          delete updatedUserData[62];
          delete updatedUserData[64];
          delete updatedUserData[65];
        } else {
          updatedUserData[idPregunta] = opcionesOrdenadas[0].idalternativa;
        }

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
      <input
        type="range"
        min="0"
        max={opcionesOrdenadas.length - 1}
        step="1"
        value={selectedIndex !== -1 ? selectedIndex : 0}
        onChange={handleRangeChange}
        className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
      />

      <div className="block sm:hidden mt-2 text-center text-sm text-gray-600">
        {opcionesOrdenadas[selectedIndex]?.textoalternativa}
      </div>

      <div
        className="hidden sm:grid sm:grid-cols-5 gap-2 mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 w-full px-2"
        style={{
          gridTemplateColumns: `repeat(${opcionesOrdenadas.length}, 1fr)`,
        }}
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
