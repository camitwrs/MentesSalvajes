import { useState } from "react";
import SubirArchivoBoton from "./SubirArchivoBoton";
import prototipoImage from "../assets/prototipo.png"; // Asegúrate de usar la ruta correcta para la imagen

const InstruccionesIlustracion = ({ ilustracion, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFileUpload = (file) => {
    console.log("Archivo recibido:", file);
    alert(`Archivo "${file.name}" subido exitosamente.`);
    setIsModalOpen(false);
  };

  if (!ilustracion) {
    return (
      <div className="text-center mt-4">
        <p className="text-gray-600 text-sm">
          No se ha seleccionado ninguna ilustración.
        </p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition duration-300 mt-2 text-sm"
        >
          Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-4 p-4 bg-white shadow-md rounded-lg text-sm">
      <h2 className="text-xl font-bold mb-2">Detalles de la Ilustración</h2>
      <div className="mb-2">
        <p>
          <strong>Título:</strong> {ilustracion.titulo}
        </p>
        <p>
          <strong>Prompt:</strong> {ilustracion.prompt}
        </p>
        <p>
          <strong>Proyecto:</strong> {ilustracion.idDisenador}
        </p>
        <p>
          <strong>Fecha de Entrega:</strong>{" "}
          {new Date(ilustracion.fechaentrega).toLocaleDateString()}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={
              ilustracion.estado === "Pendiente"
                ? "text-red-500"
                : "text-green-500"
            }
          >
            {ilustracion.estado}
          </span>
        </p>
      </div>

      {/* Mostrar imagen cuando el estado sea "Aprobado" */}
      {ilustracion.estado === "Aprobado" && (
        <div className="mb-2 flex justify-center">
          <img
            src={prototipoImage}
            alt="Prototipo Aprobado"
            className="w-[350px] h-auto rounded-lg" // Cambiado tamaño a 150px de ancho
          />
        </div>
      )}

      {ilustracion.imagen && ilustracion.estado !== "Aprobado" && (
        <div className="mb-2 flex justify-center">
          <img
            src={ilustracion.imagen}
            alt={ilustracion.titulo}
            className="w-[350px] h-auto rounded-lg" // Cambiado tamaño a 150px de ancho
          />
        </div>
      )}

      <div className="flex gap-2 justify-between">
        <button
          onClick={onBack}
          className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition duration-300 text-sm"
        >
          Regresar
        </button>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700 transition duration-300 text-sm"
        >
          Subir Archivo
        </button>
      </div>

      {isModalOpen && (
        <SubirArchivoBoton
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default InstruccionesIlustracion;
