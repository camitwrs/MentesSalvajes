import React from "react";

const ListaIlustraciones = ({ ilustraciones, onSelect }) => {
  return (
    <div className="container mx-auto mt-8">
      {/* Si no hay ilustraciones */}
      {ilustraciones.length === 0 ? (
        <p className="text-gray-600 text-center">
          No hay ilustraciones disponibles.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ilustraciones.map((ilustracion) => (
            <div
              key={ilustracion.idIlustracion}
              className="p-4 bg-white border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition"
            >
              <h5 className="text-lg font-bold text-gray-900 mb-2">
                {ilustracion.titulo || "Ilustración"}
              </h5>
              <p className="text-sm text-gray-500 mb-2">
                Fecha de Entrega:{" "}
                {new Date(ilustracion.fechaentrega).toLocaleDateString()}
              </p>
              <p
                className={`font-semibold mb-4 ${
                  ilustracion.estado === "Pendiente"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                Estado: {ilustracion.estado}
              </p>
              <button
                onClick={() => onSelect(ilustracion.idIlustracion)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Ver detalles
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaIlustraciones;
