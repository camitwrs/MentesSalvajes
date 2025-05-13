import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody } from '@heroui/card';
import Chart from 'react-apexcharts';
import { getPreguntasPorCuestionarioRequest } from '../../api/preguntas';
import {
  getTotalAlternativasRespondidasRequest,
  getAlternativasPorPreguntaRequest,
} from '../../api/alternativas';
import SimpleChart from './SimpleChart'; // Asegúrate de tener este archivo

const tipoGraficoPorPregunta = {
  1: "donut",
  2: "bar",
  3: "donut",
  4: "donut",
  5: "bar",
  6: "bar",
  7: "bar",
  8: "bar",
  9: "bar",
  10: "bar",
  11: "bar",
  12: "bar",
  13: "bar",
  14: "bar",
  15: "donut",
  16: "bar",
  17: "donut",
  18: "donut",
  19: "bar",
  20: "bar",
  21: "bar",
  22: "bar",
  23: "bar",
  24: "bar",
  25: "bar",
  26: "bar",
  27: "bar",
  28: "bar",
  29: "bar",
  30: "bar",
  31: "bar",
  32: "bar",
  33: "bar",
  34: "bar",
  35: "bar",
  36: "bar",
  37: "bar",
  38: "bar",
  39: "bar",
  40: "bar",
};

const ResumenPage = () => {
  const { idcuestionario } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [alternativasData, setAlternativasData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const preguntasResponse = await getPreguntasPorCuestionarioRequest(idcuestionario);
        const preguntasFiltradas = preguntasResponse.data.map((pregunta) => ({
          idpregunta: pregunta.idpregunta,
          textopregunta: pregunta.textopregunta,
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
    const tipo = tipoGraficoPorPregunta[pregunta.idpregunta] || "bar";

    if (alternativas.length === 0) {
      return <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>;
    }

    const labels = alternativas.map((alt) => getTextoAlternativa(pregunta.idpregunta, alt.idalternativa));
    const values = alternativas.map((alt) => alt.total_respuestas);

    if (tipo === "donut") {
      return (
        <SimpleChart
          labels={labels}
          series={values}
          title="Distribución de respuestas"
        />
      );
    }

    return (
      <Chart
        options={{
          chart: { type: "bar" },
          xaxis: { categories: labels },
          tooltip: {
            y: {
              formatter: (val) => `${val} respuestas`,
            },
          },
        }}
        series={[{ name: "Respuestas", data: values }]}
        type="bar"
        height={300}
      />
    );
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Resumen del Cuestionario</h1>

      {preguntas.map((pregunta) => (
        <Card key={pregunta.idpregunta} className="shadow-md">
          <CardHeader>
            <h2 className="text-lg font-semibold text-YankeesBlue">
              {pregunta.textopregunta}
            </h2>
          </CardHeader>
          <CardBody>
            {renderChart(pregunta)}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ResumenPage;
