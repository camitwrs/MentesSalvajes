import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import { Card, CardHeader, CardBody } from "@heroui/card";
//import Chart from "react-apexcharts";
import { getPreguntasPorCuestionarioRequest } from "../../api/preguntas";
import {
  getTotalAlternativasRespondidasRequest,
  getAlternativasPorPreguntaRequest,
} from "../../api/alternativas";
import SimpleChart from "../components/SimpleChart";
import ColumnChart from "../components/ColumnChart";
import RadarChart from "../components/RadarChart";
import AngleChart from "../components/AngleChart";
import FiltroSesion from "../components/FiltroSesion";

const preguntasExcluidas = [8, 14, 29, 30, 31, 32, 35, 36, 37];

const tipoGraficoPorPregunta = (id) => {
  const pie = [1, 3, 4, 25, 27, 28, 40];
  const column = [2, 26, 33, 38];
  const radar = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 34, 39];
  const angle = [5, 6, 7, 9, 10, 11];

  if (pie.includes(id)) return "pie";
  if (column.includes(id)) return "column";
  if (radar.includes(id)) return "radar";
  if (angle.includes(id)) return "angle";
  return "pie";
};

const ResumenPage = () => {
  const { idcuestionario } = useParams();
  const [filtroSesion, setFiltroSesion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [alternativasData, setAlternativasData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const preguntasResponse = await getPreguntasPorCuestionarioRequest(
          idcuestionario
        );
        const preguntasFiltradas = preguntasResponse.data.map((pregunta) => ({
          idpregunta: pregunta.idpregunta,
          textopregunta: pregunta.textopregunta,
        }));
        setPreguntas(preguntasFiltradas);

        const respuestasResponse = await getTotalAlternativasRespondidasRequest(
          filtroSesion
        );
        setRespuestasPorPregunta(respuestasResponse.data);

        const alternativasPorPregunta = {};
        const alternativasRequests = preguntasFiltradas.map(
          async (pregunta) => {
            const response = await getAlternativasPorPreguntaRequest(
              pregunta.idpregunta
            );
            alternativasPorPregunta[pregunta.idpregunta] = response.data.reduce(
              (acc, alt) => {
                acc[alt.idalternativa] = alt.textoalternativa;
                return acc;
              },
              {}
            );
          }
        );

        await Promise.all(alternativasRequests);
        setAlternativasData(alternativasPorPregunta);
      } catch (err) {
        setError(err.message || "Error al cargar los datos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idcuestionario, filtroSesion]);

  const getRespuestasParaPregunta = (idpregunta) => {
    return (
      respuestasPorPregunta.find((item) => item.idpregunta === idpregunta)
        ?.alternativas || []
    );
  };

  const getTextoAlternativa = (idpregunta, idalternativa) => {
    const texto = alternativasData[idpregunta]?.[idalternativa];
    return texto && texto.trim() !== "" ? texto : "No aplica";
  };

  const getTotalRespuestasPregunta = (idpregunta) => {
    const alternativas = getRespuestasParaPregunta(idpregunta);
    return alternativas.reduce(
      (acc, alt) => acc + Number(alt.total_respuestas),
      0
    );
  };

  const renderChart = (pregunta) => {
    const respuestas = getRespuestasParaPregunta(pregunta.idpregunta);
    const alternativasTexto = alternativasData[pregunta.idpregunta] || {};

    // Paso 1: armar mapa de conteo por texto
    const alternativasCompletasMap = Object.entries(alternativasTexto).reduce(
      (acc, [id, texto]) => {
        const encontrada = respuestas.find(
          (r) => r.idalternativa === Number(id)
        );
        const total = encontrada ? Number(encontrada.total_respuestas) : 0;
        const key = texto.toLowerCase().includes("no aplica")
          ? "No Aplica"
          : texto;

        if (!acc[key]) acc[key] = 0;
        acc[key] += total;
        return acc;
      },
      {}
    );

    // Paso 2: agregar manualmente "No Aplica" si viene suelta
    respuestas.forEach((resp) => {
      const id = resp.idalternativa;
      if (!alternativasTexto[id]) {
        let texto = getTextoAlternativa(pregunta.idpregunta, id);
        if (texto.toLowerCase().includes("no aplica")) {
          if (!alternativasCompletasMap["No Aplica"])
            alternativasCompletasMap["No Aplica"] = 0;
          alternativasCompletasMap["No Aplica"] += Number(
            resp.total_respuestas
          );
        }
      }
    });

    // Paso 3: construir array ordenado por idalternativa
    const alternativasCompletas = Object.entries(alternativasTexto)
      .map(([id, texto]) => {
        const key = texto.toLowerCase().includes("no aplica")
          ? "No Aplica"
          : texto;
        return {
          idalternativa: Number(id),
          textoalternativa: key,
          total_respuestas: alternativasCompletasMap[key] || 0,
        };
      })
      .sort((a, b) => a.idalternativa - b.idalternativa);

    // Paso 4: agregar "No Aplica" suelta si no está incluida
    if (
      alternativasCompletasMap["No Aplica"] &&
      !alternativasCompletas.some((a) => a.textoalternativa === "No Aplica")
    ) {
      alternativasCompletas.push({
        idalternativa: 9999,
        textoalternativa: "No Aplica",
        total_respuestas: alternativasCompletasMap["No Aplica"],
      });
    }

    const labels = alternativasCompletas.map((alt) => alt.textoalternativa);
    const values = alternativasCompletas.map((alt) => alt.total_respuestas);

    const tipo = tipoGraficoPorPregunta(pregunta.idpregunta);

    if (alternativasCompletas.length === 0) {
      return (
        <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>
      );
    }

    if (tipo === "pie") {
      return <SimpleChart labels={labels} series={values} title="Respuestas" />;
    }

    if (tipo === "column") {
      return (
        <ColumnChart
          series={[{ name: "Respuestas", data: values }]}
          categories={labels}
        />
      );
    }

    if (tipo === "radar") {
      return (
        <RadarChart
          series={[{ name: "Respuestas", data: values }]}
          categories={labels}
        />
      );
    }

    if (tipo === "angle") {
      return <AngleChart series={values} labels={labels} />;
    }

    return null;
  };

  if (loading) return <p className="text-center text-gray-600">Cargando...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <FiltroSesion
        onChange={(codigo) => setFiltroSesion(codigo)}
        idcuestionario={idcuestionario}
      />

      <h1 className="text-2xl font-extrabold text-gray-900 mb-10 text-center">
        Resumen del Cuestionario
      </h1>

      <div className="space-y-12">
        {preguntas
          .filter((p) => !preguntasExcluidas.includes(p.idpregunta))
          .map((pregunta) => (
            <div
              key={pregunta.idpregunta}
              className="bg-white shadow-md rounded-lg border-l-4 border-blue-500 p-6 space-y-4"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {pregunta.textopregunta}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Total de respuestas:{" "}
                  {getTotalRespuestasPregunta(pregunta.idpregunta)}
                </p>
              </div>

              <div className="w-full overflow-x-auto">
                <div>{renderChart(pregunta)}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ResumenPage;
