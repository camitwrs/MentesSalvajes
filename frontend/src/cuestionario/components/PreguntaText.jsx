import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const PreguntaTexto = ({ idPregunta, userData, setUserData }) => {
  const [height, setHeight] = useState("auto"); // Estado para controlar la altura del textarea

  // Determinar el placeholder según el idPregunta
  const placeholder =
    [26, 31, 36].includes(idPregunta) // Verificar si el idPregunta es 26, 31 o 36
      ? "Escribe tu respuesta en un máximo de 200 caracteres"
      : "Escribe tu respuesta";

  const handleTextChange = (e) => {
    const value = e.target.value; // Obtener el texto ingresado

    // Actualizar el valor en el estado
    setUserData((prevUserData) => ({
      ...prevUserData,
      [idPregunta]: value,
    }));

    // Ajustar la altura del textarea según el contenido
    setHeight("auto"); // Primero, restablecer la altura a "auto"
    setHeight(`${e.target.scrollHeight}px`); // Luego, ajustar la altura al contenido
  };

  // Efecto para ajustar la altura inicial del textarea
  useEffect(() => {
    const textarea = document.getElementById(`textarea-${idPregunta}`);
    if (textarea) {
      setHeight(`${textarea.scrollHeight}px`);
    }
  }, [idPregunta]);

  return (
    <div className="w-full">
      <textarea
        id={`textarea-${idPregunta}`} // ID único para el textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out resize-none overflow-hidden"
        value={userData[idPregunta] || ""}
        onChange={handleTextChange}
        placeholder={placeholder} // Usar el placeholder dinámico
        maxLength="200" // Limitar a 200 caracteres
        style={{ height }} // Establecer la altura dinámica
        rows={1} // Número inicial de filas
      />
    </div>
  );
};

PreguntaTexto.propTypes = {
  idPregunta: PropTypes.number.isRequired,
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
};

export default PreguntaTexto;