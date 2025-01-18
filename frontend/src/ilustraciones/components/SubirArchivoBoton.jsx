import { useState } from "react";

const SubirArchivoBoton = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [error, setError] = useState(""); // Estado para mostrar errores

  // Maneja la selección de archivos
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Valida el tipo y tamaño del archivo
      if (
        ![
          "image/png",
          "image/jpeg",
          "image/svg+xml",
          "application/pdf",
        ].includes(selectedFile.type)
      ) {
        setError("Solo se permiten archivos PNG, JPEG, SVG o PDF.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        // 20 MB máximo
        setError("El archivo no debe exceder los 20 MB.");
        setFile(null);
        return;
      }
      setError(""); // Limpia errores previos
      setFile(selectedFile); // Establece el archivo seleccionado
    }
  };

  // Maneja la subida del archivo
  const handleUpload = () => {
    if (!file) {
      setError("Por favor, selecciona un archivo antes de subirlo.");
      return;
    }
    onUpload(file); // Llama a la función de subida (definida en el componente padre)
    onClose(); // Cierra el modal después de la subida
  };

  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Subir Ilustración</h2>

        {/* Input para seleccionar el archivo */}
        <input
          type="file"
          accept=".png, .jpeg, .jpg, .svg, .pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
        />

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Botones de acción */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubirArchivoBoton;
