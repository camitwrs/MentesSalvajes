import React, { useState } from "react";

const AprobarIlustracion = ({ ilustracion, onApprove, onReject, onBack }) => {
  const [comments, setComments] = useState("");

  const handleApprove = () => {
    if (!ilustracion) return;
    onApprove(ilustracion.id, comments);
  };

  const handleReject = () => {
    if (!ilustracion) return;
    onReject(ilustracion.id, comments);
  };

  if (!ilustracion) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-600">
          No se ha seleccionado ninguna ilustración.
        </p>
        <button
          onClick={onBack}
          className="bg-YankeesBlue text-white font-bold py-2 px-4 rounded hover:bg-YankeesBlueDark transition duration-300 mt-4"
        >
          Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Revisar Ilustración</h2>
      <div className="mb-4">
        <p>
          <strong>Nombre:</strong> {ilustracion.nombre}
        </p>
        <p>
          <strong>Proyecto:</strong> {ilustracion.proyecto}
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
      <div className="mb-4">
        <p>
          <strong>Descripción:</strong>{" "}
          {ilustracion.descripcion || "Sin descripción."}
        </p>
      </div>
      <textarea
        className="border p-2 w-full mb-4"
        placeholder="Agregar comentarios (opcional)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
      ></textarea>
      <div className="flex justify-end gap-4">
        <button
          onClick={onReject}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
        >
          Rechazar
        </button>
        <button
          onClick={handleApprove}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Aprobar
        </button>
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default ApproveIllustration;
