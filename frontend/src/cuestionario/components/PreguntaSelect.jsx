import PropTypes from "prop-types";

const PreguntaSelect = ({ idPregunta, opciones, userData, setUserData }) => {
  const handleSelectChange = (e) => {
    const value = parseInt(e.target.value, 10); // Convertir a número
    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: value, // Actualizar el valor seleccionado en el estado
    }));
  };

  // Ordenar las opciones por idalternativa de menor a mayor
  const opcionesOrdenadas = opciones.sort((a, b) => a.idalternativa - b.idalternativa);

  return (
    <div className="w-full">
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
        value={userData[idPregunta] || ""}
        onChange={handleSelectChange}
      >
        <option value="" disabled hidden>
          Seleccione una opción
        </option>
        {opcionesOrdenadas.map((opcion) => (
          <option key={opcion.idalternativa} value={opcion.idalternativa}>
            {opcion.textoalternativa}
          </option>
        ))}
      </select>
    </div>
  );
};

PreguntaSelect.propTypes = {
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

export default PreguntaSelect;