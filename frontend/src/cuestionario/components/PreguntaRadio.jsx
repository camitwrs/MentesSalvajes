import PropTypes from "prop-types";

const PreguntaRadio = ({ idPregunta, opciones, userData, setUserData }) => {
  const handleRadioChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: value,
    }));
  };

  return (
    <div className="w-full">
      {opciones.map((opcion) => (
        <label
          key={opcion.idalternativa}
          className="flex items-center gap-2 mb-2 p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
        >
          <input
            type="radio"
            name={`pregunta-${idPregunta}`}
            value={opcion.idalternativa}
            checked={userData[idPregunta] === opcion.idalternativa}
            onChange={handleRadioChange}
            className="h-5 w-5 text-blue-600 flex-shrink-0" // Radio de tamaño fijo
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
