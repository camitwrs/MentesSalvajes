import React from "react";

const PreguntaTipoNumber = ({
  idPregunta,
  userData,
  setUserData,
  min,
  max,
  numberError,
  setNumberError,
}) => {
  const handleNumberChange = (e) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10); // Convertir a número o mantener vacío

    // Actualizar el estado con el valor ingresado
    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: value,
    }));

    // Validar el valor ingresado
    if (value !== "") {
      if (value < min) {
        setNumberError(`El número debe ser al menos ${min}.`);
      } else if (value > max) {
        setNumberError(`El número no puede exceder ${max}.`);
      } else {
        setNumberError(""); // Limpiar error si el valor es válido
      }
    } else {
      setNumberError(""); // Limpiar error si el campo está vacío
    }
  };

  return (
    <div className="w-full">
      <input
        type="number"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
        value={userData[idPregunta] || ""}
        onChange={handleNumberChange}
        placeholder={`Ingresa un número entre ${min} y ${max}`}
        min={min}
        max={max}
        step={1}
      />
      {/* Mostrar mensaje de error si existe */}
      {numberError && (
        <span className="text-red-600 text-xs sm:text-sm mt-2 block">
          {numberError}
        </span>
      )}
    </div>
  );
};

export default PreguntaTipoNumber;
