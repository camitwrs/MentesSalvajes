import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { ClipboardIcon, BarChartIcon as ChartBarIcon, UserIcon } from "lucide-react";
import { getCuestionariosRequest } from "../../api/cuestionarios";
import { getTotalAllRespuestasRequest } from '../../api/respuestas';

const EstadisticaCuestionarios = () => {
  const [stats, setStats] = useState({
    totalCuestionarios: 0,
    totalRespuestas: '--', // Mostramos -- mientras carga
    participantesUnicos: 0,
    incrementoCuestionarios: 0,
    incrementoRespuestas: 0,
    incrementoParticipantes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos en paralelo
        const [cuestionariosResponse, respuestasResponse] = await Promise.all([
          getCuestionariosRequest(),
          getTotalAllRespuestasRequest()
        ]);

        console.log("Respuesta de total respuestas:", respuestasResponse); // Para diagnóstico

        // 1. Procesar cuestionarios
        const cuestionarios = Array.isArray(cuestionariosResponse) 
          ? cuestionariosResponse 
          : cuestionariosResponse?.data || [];

        // 2. Obtener total de respuestas (según la estructura que compartiste)
        const totalRespuestas = respuestasResponse?.data?.total_respuestas || '0';

        // 3. Calcular otros valores
        const totalCuestionarios = cuestionarios.length;
        const participantesUnicos = Math.floor(Number(totalRespuestas) * 0.7); // Estimación
        
        setStats({
          totalCuestionarios,
          totalRespuestas,
          participantesUnicos,
          incrementoCuestionarios: 0, // Temporal
          incrementoRespuestas: 0,    // Temporal
          incrementoParticipantes: 0  // Temporal
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
          <h3 className="text-gray-700 font-medium">Total Cuestionarios</h3>
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
          <h3 className="text-gray-700 font-medium">Total Respuestas</h3>
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

      {/* Card 3: Participantes Únicos */}
      <Card className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-gray-700 font-medium">Participantes Únicos</h3>
          <div className="p-2 rounded-full bg-purple-50 text-purple-500">
            <UserIcon className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-2 pt-4">
          <div className="text-4xl font-bold text-gray-900">
            {stats.participantesUnicos}
          </div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-500">
            <span className="text-green-500 font-medium">+{stats.incrementoParticipantes}</span> desde el mes pasado
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EstadisticaCuestionarios;