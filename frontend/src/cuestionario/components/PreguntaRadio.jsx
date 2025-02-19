import PropTypes from "prop-types";

const PreguntaRadio = ({ idPregunta, opciones, userData, setUserData }) => {
  const handleRadioChange = (e) => {
    const value = parseInt(e.target.value, 10);

    setUserData((prevUserData) => {
      const updatedUserData = { ...prevUserData, [idPregunta]: value };

      // Verificar si la pregunta 20 tiene seleccionada la alternativa 67
      if (idPregunta === 20 && value === 67) {
        delete updatedUserData[21];
      }

      // Verificar si la pregunta 56 tiene seleccionada la alternativa 154
      if (idPregunta === 56 && value === 154) {
        delete updatedUserData[57];
        delete updatedUserData[58];
      }

      return updatedUserData;
    });
  };

  // Ordenar las opciones por idalternativa de menor a mayor
  const opcionesOrdenadas = opciones.sort((a, b) => a.idalternativa - b.idalternativa);

  return (
    <div className="w-full">
      {opcionesOrdenadas.map((opcion) => (
        <label
          key={opcion.idalternativa}
          className="flex items-center mb-2 p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
        >
          <input
            type="radio"
            name={`pregunta-${idPregunta}`}
            value={opcion.idalternativa}
            checked={userData[idPregunta] === opcion.idalternativa}
            onChange={handleRadioChange}
            className="mr-2 h-5 w-5 text-blue-600 flex-shrink-0"
          />
          <span className="text-gray-700 text-sm sm:text-base leading-normal">
            {opcion.textoalternativa}
          </span>
        </label>
      ))}
    </div>
  );
};

PreguntaRadio.propTypes = {
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

export default PreguntaRadio;