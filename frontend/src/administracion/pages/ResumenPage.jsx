import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '@heroui/card';
import Chart from 'react-apexcharts';
import { 
  getPreguntasPorCuestionarioRequest
} from '../../api/preguntas';
import { getTotalAlternativasRespondidasRequest,
    getAlternativasPorPreguntaRequest } from '../../api/alternativas';

const ResumenPage = () => {
  const { idcuestionario } = useParams();
  const location = useLocation(); // Obtener la ubicación actual
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [alternativasData, setAlternativasData] = useState({});

  // Obtener el parámetro `session` de la URL
  const searchParams = new URLSearchParams(location.search);
  const codigosesion = searchParams.get('session'); // Si existe, obtendrá el valor de `session`

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const preguntasResponse = await getPreguntasPorCuestionarioRequest(idcuestionario);
        const preguntasFiltradas = preguntasResponse.data
          .filter(pregunta => pregunta.idpregunta >= 7)
          .map(pregunta => ({
            idpregunta: pregunta.idpregunta,
            textopregunta: pregunta.textopregunta,
            tipopregunta: pregunta.tipopregunta
          }));
        
        setPreguntas(preguntasFiltradas);

        const respuestasResponse = await getTotalAlternativasRespondidasRequest();
        setRespuestasPorPregunta(respuestasResponse.data);

        const alternativasPorPregunta = {};
        for (const pregunta of preguntasFiltradas) {
          const response = await getAlternativasPorPreguntaRequest(pregunta.idpregunta);
          alternativasPorPregunta[pregunta.idpregunta] = response.data.reduce((acc, alt) => {
            acc[alt.idalternativa] = alt.textoalternativa;
            return acc;
          }, {});
        }
        setAlternativasData(alternativasPorPregunta);

      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idcuestionario]);

  const getRespuestasParaPregunta = (idpregunta) => {
    return respuestasPorPregunta.find(item => item.idpregunta === idpregunta)?.alternativas || [];
  };

  const getTextoAlternativa = (idpregunta, idalternativa) => {
    return alternativasData[idpregunta]?.[idalternativa] || `Alternativa ${idalternativa}`;
  };

  const renderChart = (pregunta) => {
    const alternativas = getRespuestasParaPregunta(pregunta.idpregunta);
    
    if (alternativas.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay respuestas registradas para esta pregunta</p>
        </div>
      );
    }

    const categorias = alternativas.map(alt => 
      getTextoAlternativa(pregunta.idpregunta, alt.idalternativa)
    );
    const datos = alternativas.map(alt => alt.total_respuestas);
    const totalRespuestas = datos.reduce((a, b) => a + b, 0);

    // Configuración del gráfico de barras verticales
    const options = {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%',
          distributed: false,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#333"]
        }
      },
      xaxis: {
        categories: categorias,
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          },
          formatter: function(value) {
            return value.length > 15 ? value.substring(0, 15) + '...' : value;
          }
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: true
        }
      },
      yaxis: {
        title: {
          text: "Número de respuestas",
          style: {
            fontSize: '12px',
            fontWeight: 'bold'
          }
        },
        labels: {
          formatter: function(val) {
            return Math.floor(val);
          }
        }
      },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      tooltip: {
        y: {
          formatter: function(value) {
            const porcentaje = totalRespuestas > 0 ? ((value / totalRespuestas) * 100).toFixed(1) : 0;
            return `${value} respuestas (${porcentaje}%)`;
          }
        }
      },
      grid: {
        row: {
          colors: ['#f3f4f6', 'transparent'],
          opacity: 0.5
        }
      }
    };

    const series = [{
      name: 'Respuestas',
      data: datos
    }];

    return (
      <div className="mt-4">
        <Chart 
          options={options} 
          series={series} 
          type="bar" 
          height={350} 
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Total de respuestas: {totalRespuestas}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando datos...</span>
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
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Resumen del Cuestionario</h1>
      
      {preguntas.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay preguntas disponibles para mostrar</p>
        </div>
      ) : (
        <div className="space-y-8">
          {preguntas.map((pregunta, index) => {
            const respuestas = getRespuestasParaPregunta(pregunta.idpregunta);
            const totalRespuestas = respuestas.reduce((sum, alt) => sum + alt.total_respuestas, 0);
            
            return (
              <Card key={pregunta.idpregunta} className="shadow-md">
                <CardHeader 
                  title={
                    <div className="flex justify-between items-center">
                      <span>Pregunta {index + 1}</span>
                      <span className="text-sm font-normal text-gray-500">
                        {totalRespuestas} respuestas
                      </span>
                    </div>
                  } 
                />
                <CardBody>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-800">{pregunta.textopregunta}</p>
                    </div>
                    
                    {renderChart(pregunta)}

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alternativa</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Texto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuestas</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porcentaje</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {respuestas.map((alternativa) => (
                            <tr key={alternativa.idalternativa} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{alternativa.idalternativa}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {getTextoAlternativa(pregunta.idpregunta, alternativa.idalternativa)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {alternativa.total_respuestas}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {totalRespuestas > 0 
                                  ? ((alternativa.total_respuestas / totalRespuestas) * 100).toFixed(1) + '%'
                                  : '0%'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResumenPage;