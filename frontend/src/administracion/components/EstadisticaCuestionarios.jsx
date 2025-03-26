import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { ClipboardIcon, BarChartIcon as ChartBarIcon, UserIcon } from "lucide-react";
import { getCuestionariosRequest, getDiferenciaCuestionariosRequest} from "../../api/cuestionarios";
import { getTotalAllRespuestasRequest, getDiferenciaRespuestasRequest } from '../../api/respuestas';
import { getTotalEducadoresRequest, getDiferenciaEducadoresRequest } from "../../api/usuarios";

const EstadisticaCuestionarios = () => {
  const [stats, setStats] = useState({
    totalCuestionarios: 0,
    totalRespuestas: '--',
    totalEducadores: '--',
    incrementoCuestionarios: '--',
    incrementoRespuestas: '--',
    incrementoEducadores: '--' // Inicializado como '--' para indicar carga
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los datos necesarios en paralelo
        const [
          cuestionariosResponse, 
          respuestasResponse, 
          educadoresResponse,
          diferenciaCuestionariosResponse,
          diferenciaRespuestaResponse,
          diferenciaEducadoresResponse
        ] = await Promise.all([
          getCuestionariosRequest(),
          getTotalAllRespuestasRequest(),
          getTotalEducadoresRequest(),
          getDiferenciaCuestionariosRequest(),
          getDiferenciaRespuestasRequest(),
          getDiferenciaEducadoresRequest()
        ]);

        // 1. Procesar cuestionarios
        const cuestionarios = Array.isArray(cuestionariosResponse) 
          ? cuestionariosResponse 
          : cuestionariosResponse?.data || [];

        // 2. Obtener total de respuestas
        const totalRespuestas = respuestasResponse?.data?.total_respuestas || '0';

        // 3. Obtener total de educadores
        const totalEducadores = educadoresResponse?.data?.total_educadores || '0';

        // Obtener incremento de cuestionarios
        const incrementoCuestionarios = diferenciaCuestionariosResponse?.data?.diferencia_cuestionarios || '0';

        // Obtener incremento de respuestas
        const incrementoRespuestas = diferenciaRespuestaResponse?.data?.diferencia_respuestas || '0';

        // 4. Obtener incremento de educadores
        const incrementoEducadores = diferenciaEducadoresResponse?.data?.diferencia_educadores || '0';

        setStats({
          totalCuestionarios: cuestionarios.length,
          totalRespuestas,
          totalEducadores,
          incrementoCuestionarios, // Temporal (puedes implementar similar a educadores)
          incrementoRespuestas,
          incrementoEducadores
        });

      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
        setError("Error al cargar los datos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <CardBody className="p-4">
              <div className="animate-pulse flex flex-col space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardBody>
          </Card>
        ))}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Card 1: Total Cuestionarios */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-gray-700 font-medium">Total de Cuestionarios</h3>
          <div className="p-2 rounded-full bg-blue-50 text-blue-500">
            <ClipboardIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2 pt-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.totalCuestionarios}
          </div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500 font-medium">+{stats.incrementoCuestionarios}</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>

      {/* Card 2: Total Respuestas */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-gray-700 font-medium">Total de Respuestas</h3>
          <div className="p-2 rounded-full bg-green-50 text-green-500">
            <ChartBarIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2 pt-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.totalRespuestas}
          </div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500 font-medium">+{stats.incrementoRespuestas}</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>

      {/* Card 3: Educadores en el Sistema */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-gray-700 font-medium">Educadores en el Sistema</h3>
          <div className="p-2 rounded-full bg-purple-50 text-purple-500">
            <UserIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2 pt-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.totalEducadores}
          </div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500 font-medium">+{stats.incrementoEducadores}</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EstadisticaCuestionarios;