import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPreguntasPorCuestionarioRequest } from "../../api/preguntas";
import {
  getTotalAlternativasRespondidasRequest,
  getAlternativasPorPreguntaRequest,
} from "../../api/alternativas";
import { getRespuestasPorCodigoRequest } from "../../api/respuestas";
import SimpleChart from "../components/SimpleChart";
import ColumnChart from "../components/ColumnChart";
import RadarChart from "../components/RadarChart";
import AngleChart from "../components/AngleChart";
import FiltroSesion from "../components/FiltroSesion";

const preguntasExcluidas = [8, 14, 29, 30, 31, 32, 35, 36, 37];

const tipoGraficoPorPregunta = (id) => {
  const pie = [1, 3, 4, 7, 25, 27, 28, 40];
  const column = [2, 9, 10, 11, 26, 33, 38];
  const radar = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 34, 39];
  const angle = [5, 6];

  if (pie.includes(id)) return "pie";
  if (column.includes(id)) return "column";
  if (radar.includes(id)) return "radar";
  if (angle.includes(id)) return "angle";
  return "pie";
};

// Agrupar respuestas planas (respuestasdetalle) en formato esperado por los gráficos
const agruparRespuestasPorPregunta = (respuestas) => {
  const agrupadas = {};

  respuestas.forEach((fila) => {
    const { idpregunta, idalternativa } = fila;

    if (!agrupadas[idpregunta]) agrupadas[idpregunta] = {};

    if (!agrupadas[idpregunta][idalternativa]) {
      agrupadas[idpregunta][idalternativa] = 0;
    }

    agrupadas[idpregunta][idalternativa]++;
  });

  return Object.entries(agrupadas).map(([idpregunta, alternativasMap]) => ({
    idpregunta: Number(idpregunta),
    alternativas: Object.entries(alternativasMap).map(
      ([idalternativa, total]) => ({
        idalternativa: Number(idalternativa),
        total_respuestas: total,
      })
    ),
  }));
};

const ResumenPage = () => {
  const { idcuestionario } = useParams();
  const [filtroSesion, setFiltroSesion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [alternativasData, setAlternativasData] = useState({});
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        if (filtroSesion && filtroSesion.trim() !== "") {
          const respuesta = await getRespuestasPorCodigoRequest(filtroSesion);
          const agrupadas = agruparRespuestasPorPregunta(respuesta.data);
          setRespuestasPorPregunta(agrupadas);
        } else {
          const respuesta = await getTotalAlternativasRespondidasRequest();
          setRespuestasPorPregunta(respuesta.data);
        }
      } catch (err) {
        setError(err.message || "Error al cargar los datos");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idcuestionario, filtroSesion]);

  const getRespuestasParaPregunta = (idpregunta) =>
    respuestasPorPregunta.find((item) => item.idpregunta === idpregunta)
      ?.alternativas || [];

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

    respuestas.forEach((resp) => {
      const id = resp.idalternativa;
      if (!alternativasTexto[id]) {
        const texto = getTextoAlternativa(pregunta.idpregunta, id);
        if (texto.toLowerCase().includes("no aplica")) {
          if (!alternativasCompletasMap["No Aplica"])
            alternativasCompletasMap["No Aplica"] = 0;
          alternativasCompletasMap["No Aplica"] += Number(
            resp.total_respuestas
          );
        }
      }
    });

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

    switch (tipo) {
      case "pie":
        return (
          <SimpleChart
            labels={labels}
            series={values}
            title="Respuestas"
            windowWidth={windowWidth}
          />
        );
      case "column":
        return (
          <ColumnChart
            series={[{ name: "Respuestas", data: values }]}
            categories={labels}
            windowWidth={windowWidth}
          />
        );
      case "radar":
        return (
          <RadarChart
            series={[{ name: "Respuestas", data: values }]}
            categories={labels}
            windowWidth={windowWidth}
          />
        );
      case "angle":
        return (
          <AngleChart
            series={values}
            labels={labels}
            windowWidth={windowWidth}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="mb-6 sm:mb-8">
          <FiltroSesion
            onChange={setFiltroSesion}
            idcuestionario={idcuestionario}
          />

          {filtroSesion && (
            <p className="text-center text-xs sm:text-sm text-gray-500 mt-2 mb-4">
              Mostrando resultados para la sesión:{" "}
              <strong>{filtroSesion}</strong>
            </p>
          )}

          <h1
            className={`${
              windowWidth < 480
                ? "text-xl"
                : windowWidth < 768
                ? "text-2xl"
                : "text-3xl"
            } font-extrabold text-gray-900 mt-6 mb-8 text-center`}
          >
            Resumen del Cuestionario
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">Error: {error}</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            {preguntas
              .filter((p) => !preguntasExcluidas.includes(p.idpregunta))
              .map((pregunta) => (
                <div
                  key={pregunta.idpregunta}
                  className="bg-white shadow-md rounded-lg border-l-4 border-blue-500 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4"
                >
                  <div>
                    <h2
                      className={`${
                        windowWidth < 480
                          ? "text-sm"
                          : windowWidth < 768
                          ? "text-base"
                          : "text-lg"
                      } font-semibold text-gray-800`}
                    >
                      {pregunta.textopregunta}
                    </h2>
                    <p
                      className={`${
                        windowWidth < 768 ? "text-xs" : "text-sm"
                      } text-gray-500 mt-1`}
                    >
                      Total de respuestas:{" "}
                      {getTotalRespuestasPregunta(pregunta.idpregunta)}
                    </p>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <div
                      className={`${
                        windowWidth < 480 ? "min-w-[280px]" : "min-w-full"
                      }`}
                    >
                      {renderChart(pregunta)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumenPage;
