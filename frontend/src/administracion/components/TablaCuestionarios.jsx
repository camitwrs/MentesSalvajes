import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import ResumenPage from "../pages/ResumenPage";
import { getCuestionariosRequest } from "../../api/cuestionarios";

const TablaCuestionarios = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCuestionariosRequest();

        // Manejo de diferentes formatos de respuesta
        let data = [];

        if (Array.isArray(response)) {
          // Caso 1: La respuesta es directamente un array
          data = response;
        } else if (response.data && Array.isArray(response.data)) {
          // Caso 2: La respuesta tiene un campo data que es array
          data = response.data;
        } else if (typeof response === "object" && response !== null) {
          // Caso 3: La respuesta es un objeto (convertimos a array)
          data = Object.values(response);
        } else {
          throw new Error("Formato de respuesta no soportado");
        }

        setCuestionarios(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error al obtener cuestionarios:", err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando cuestionarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (cuestionarios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No se encontraron cuestionarios
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto shadow-sm rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preguntas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Respuestas
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cuestionarios.map((cuestionario) => (
            <tr
              key={
                cuestionario.id ||
                cuestionario._id ||
                cuestionario.titulocuestionario
              }
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">
                  {cuestionario.titulocuestionario}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-600">
                  {cuestionario.preguntas || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-600">
                  {cuestionario.respuestas || 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Chip
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    cuestionario.estado === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {cuestionario.estado || "Desconocido"}
                </Chip>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                {cuestionario.fechacreacioncuestionario?.split("T")[0]}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <Button
                  color="primary"
                  size="sm"
                  onPress={() =>
                    ResumenPage(
                      cuestionario.id ||
                        cuestionario._id ||
                        cuestionario.titulocuestionario
                    )
                  }
                >
                  Ver estadísticas
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCuestionarios;
