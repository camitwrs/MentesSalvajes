import PropTypes from "prop-types";

const PreguntaCheckbox = ({
  idPregunta,
  opciones,
  userData,
  setUserData,
}) => {
  const handleCheckboxChange = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Convertir a número
    const updatedSelections = Array.isArray(userData[idPregunta])
      ? userData[idPregunta]
      : [];

    // Validar el máximo de 2 selecciones
    if (updatedSelections.length >= 2 && e.target.checked) {
      return; // No permite seleccionar más de 2 opciones
    }

    // Actualizar las selecciones
    const newSelections = e.target.checked
      ? [...updatedSelections, selectedId]
      : updatedSelections.filter((id) => id !== selectedId);

    setUserData({
      ...userData,
      [idPregunta]: newSelections,
    });
  };

  return (
    <div className="w-full">
      {opciones.map((opcion) => (
        <label
          key={opcion.idalternativa}
          className="flex items-center mb-2 p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
        >
          <input
            type="checkbox"
            value={opcion.idalternativa}
            checked={(userData[idPregunta] || []).includes(
              opcion.idalternativa
            )}
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
          />
          <span className="text-gray-700 text-sm sm:text-base">
            {opcion.textoalternativa}
          </span>
        </label>
      ))}
    </div>
  );
};

PreguntaCheckbox.propTypes = {
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

export default PreguntaCheckbox;
