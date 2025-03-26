import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useNavigate } from "react-router-dom";
import { BarChartIcon as ChartBarIcon } from "lucide-react";
import { getCuestionariosRequest } from "../../api/cuestionarios";
import { getTotalRespuestasPorCuestionarioRequest } from "../../api/respuestas";

const TablaCuestionarios = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener cuestionarios
        const response = await getCuestionariosRequest();
        
        // 2. Normalizar datos
        let data = [];
        if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          data = [];
        }

        // 3. Obtener respuestas para cada cuestionario
        const cuestionariosConRespuestas = await Promise.all(
          data.map(async (cuestionario) => {
            const id = cuestionario.idcuestionario || cuestionario.id || cuestionario._id;
            if (!id) return cuestionario;

            try {
              const { data } = await getTotalRespuestasPorCuestionarioRequest(id);
              return {
                ...cuestionario,
                totalRespuestas: data?.total_respuestas || 0
              };
            } catch (error) {
              console.error(`Error obteniendo respuestas para cuestionario ${id}:`, error);
              return {
                ...cuestionario,
                totalRespuestas: 0
              };
            }
          })
        );

        setCuestionarios(cuestionariosConRespuestas);
      } catch (err) {
        setError(err.message || "Error al cargar los cuestionarios");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerEstadisticas = (idCuestionario) => {
    navigate(`/resumen/${idCuestionario}`);
  };

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
          {cuestionarios.map((cuestionario) => {
            const isActive = cuestionario.estado?.toLowerCase() === "activo";
            const idCuestionario = cuestionario.idcuestionario || cuestionario.id;
            
            return (
              <tr key={idCuestionario} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {cuestionario.titulocuestionario || "Sin título"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600">
                    {cuestionario.preguntas?.length || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-600 font-semibold">
                    {cuestionario.totalRespuestas}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Chip
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {cuestionario.estado || "Desconocido"}
                  </Chip>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {new Date(cuestionario.fechacreacioncuestionario).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end">
                    <Button
                      color={isActive ? "primary" : "neutral"}
                      size="sm"
                      onPress={() => isActive && handleVerEstadisticas(idCuestionario)}
                      disabled={!isActive}
                      className={`flex items-center gap-1 transition-all ${
                        isActive
                          ? "hover:bg-blue-600 hover:shadow-md"
                          : "opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <ChartBarIcon className="w-4 h-4" />
                      <span>Ver estadísticas</span>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaCuestionarios;