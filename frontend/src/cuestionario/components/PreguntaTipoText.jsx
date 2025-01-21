import React from "react";

const PreguntaTipoTexto = ({ idPregunta, userData, setUserData }) => {
  const handleTextChange = (e) => {
    const value = e.target.value; // Obtener el texto ingresado
    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: value, // Actualizar el valor en el estado
    }));
  };

  return (
    <div className="w-full">
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
        value={userData[idPregunta] || ""}
        onChange={handleTextChange}
        placeholder="Escribe tu respuesta"
        maxLength="200" // Limitar a 200 caracteres
      />
    </div>
  );
};

export default PreguntaTipoTexto;
