import React from "react";

const PreguntaTipoRange = ({ idPregunta, opciones, userData, setUserData }) => {
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

  return (
    <div className="w-full">
      {/* Control deslizante */}
      <input
        type="range"
        min="0"
        max={opciones.length - 1}
        step="1"
        value={selectedIndex !== -1 ? selectedIndex : 0}
        onChange={handleRangeChange}
        className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
      />

      {/* Mostrar la opción seleccionada */}
      {opciones[selectedIndex] && (
        <div className="mt-2 text-center text-sm text-gray-600">
          {opciones[selectedIndex].textoalternativa}
        </div>
      )}

      {/* Mostrar todas las opciones en un formato más amplio */}
      <div
        className="hidden sm:grid grid-cols-5 mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 w-full px-2"
        style={{ gridTemplateColumns: `repeat(${opciones.length}, 1fr)` }}
      >
        {opciones.map((opcion) => (
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

export default PreguntaTipoRange;
