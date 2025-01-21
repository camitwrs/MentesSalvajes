import React from "react";

const PreguntaTipoCheckbox = ({
  idPregunta,
  opciones,
  userData,
  setUserData,
  checkboxError,
  setCheckboxError,
}) => {
  const handleCheckboxChange = (e) => {
    const selectedId = parseInt(e.target.value, 10); // Convertir a número
    const updatedSelections = Array.isArray(userData[idPregunta])
      ? userData[idPregunta]
      : [];

    // Limitar la selección a 2 para la pregunta 8 (puedes personalizar esto)
    if (idPregunta === 8 && updatedSelections.length >= 2 && e.target.checked) {
      setCheckboxError(
        "Puedes seleccionar un máximo de 2 opciones para esta pregunta."
      );
      return; // No permite seleccionar más de 2 opciones
    }

    let newSelections;
    if (e.target.checked) {
      newSelections = [...updatedSelections, selectedId];
      setCheckboxError(""); // Limpiar errores si todo es válido
    } else {
      newSelections = updatedSelections.filter((id) => id !== selectedId);
    }

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
            checked={(userData[idPregunta] || []).includes(opcion.idalternativa)}
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
          />
          <span className="text-gray-700 text-sm sm:text-base">
            {opcion.textoalternativa}
          </span>
        </label>
      ))}
      {/* Mostrar error si existe */}
      {checkboxError && (
        <span className="text-red-600 text-xs sm:text-sm mt-2 block">
          {checkboxError}
        </span>
      )}
    </div>
  );
};

export default PreguntaTipoCheckbox;
