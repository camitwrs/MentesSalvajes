import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@heroui/button";
import { getPreguntasPorCuestionarioRequest } from "../../api/preguntas";
import {
  getTotalAlternativasRespondidasRequest,
  getAlternativasPorPreguntaRequest,
} from "../../api/alternativas";
import { getRespuestasPorCodigoRequest } from "../../api/respuestas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SimpleChart from "../components/SimpleChart";
import ColumnChart from "../components/ColumnChart";
import RadarChart from "../components/RadarChart";
import AngleChart from "../components/AngleChart";
import FiltroSesion from "../components/FiltroSesion";
import { ArrowLeft } from "lucide-react";

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
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const navigate = useNavigate();

  // Ajuste de ventana
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Preguntas
        const preguntasResponse = await getPreguntasPorCuestionarioRequest(
          idcuestionario
        );
        const preguntasFiltradas = preguntasResponse.data.map((p) => ({
          idpregunta: p.idpregunta,
          textopregunta: p.textopregunta,
        }));
        setPreguntas(preguntasFiltradas);

        // Alternativas
        const alternativasPorPregunta = {};
        await Promise.all(
          preguntasFiltradas.map(async (pregunta) => {
            const resp = await getAlternativasPorPreguntaRequest(
              pregunta.idpregunta
            );
            alternativasPorPregunta[pregunta.idpregunta] = resp.data.reduce(
              (acc, alt) => {
                acc[alt.idalternativa] = alt.textoalternativa;
                return acc;
              },
              {}
            );
          })
        );
        setAlternativasData(alternativasPorPregunta);

        // Respuestas (por sesión o generales)
        if (filtroSesion.trim()) {
          const resp = await getRespuestasPorCodigoRequest(filtroSesion);
          setTotalParticipantes(
            new Set(resp.data.map((r) => r.idpersona)).size
          );
          setRespuestasPorPregunta(agruparRespuestasPorPregunta(resp.data));
        } else {
          const resp = await getTotalAlternativasRespondidasRequest();
          setRespuestasPorPregunta(resp.data);
          setTotalParticipantes(0);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Esta sesión no contiene respuestas.");
        } else {
          setError(err.message || "Error al cargar los datos");
        }
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
    return texto?.trim() ? texto : "No aplica";
  };

  const getTotalRespuestasPregunta = (idpregunta) => {
    const resp = getRespuestasParaPregunta(idpregunta);
    const altTexto = alternativasData[idpregunta] || {};
    const mapa = Object.entries(altTexto).reduce((acc, [id, txt]) => {
      const encontrada = resp.find((r) => r.idalternativa === Number(id));
      const total = encontrada ? Number(encontrada.total_respuestas) : 0;
      const key = txt.toLowerCase().includes("no aplica") ? "No Aplica" : txt;
      acc[key] = (acc[key] || 0) + total;
      return acc;
    }, {});
    // Respuestas sin alternativa registrada
    resp.forEach((r) => {
      if (!altTexto[r.idalternativa]) {
        const txt = getTextoAlternativa(idpregunta, r.idalternativa);
        const key = txt.toLowerCase().includes("no aplica") ? "No Aplica" : txt;
        mapa[key] = (mapa[key] || 0) + Number(r.total_respuestas);
      }
    });
    const sumActual = Object.values(mapa).reduce((a, b) => a + b, 0);
    const faltantes = totalParticipantes - sumActual;
    if (faltantes > 0) mapa["No Aplica"] = (mapa["No Aplica"] || 0) + faltantes;
    return Object.values(mapa).reduce((a, b) => a + b, 0);
  };

  const renderChart = (pregunta) => {
    // Construcción de datos para el gráfico (misma lógica que getTotal…)
    const resp = getRespuestasParaPregunta(pregunta.idpregunta);
    const altTexto = alternativasData[pregunta.idpregunta] || {};
    const mapa = Object.entries(altTexto).reduce((acc, [id, txt]) => {
      const encontrada = resp.find((r) => r.idalternativa === Number(id));
      const total = encontrada ? Number(encontrada.total_respuestas) : 0;
      const key = txt.toLowerCase().includes("no aplica") ? "No Aplica" : txt;
      acc[key] = (acc[key] || 0) + total;
      return acc;
    }, {});
    resp.forEach((r) => {
      if (!altTexto[r.idalternativa]) {
        const txt = getTextoAlternativa(pregunta.idpregunta, r.idalternativa);
        const key = txt.toLowerCase().includes("no aplica") ? "No Aplica" : txt;
        mapa[key] = (mapa[key] || 0) + Number(r.total_respuestas);
      }
    });
    const sumActual = Object.values(mapa).reduce((a, b) => a + b, 0);
    const faltantes = totalParticipantes - sumActual;
    if (faltantes > 0) mapa["No Aplica"] = (mapa["No Aplica"] || 0) + faltantes;

    const data = Object.entries(mapa).map(([txt, tot]) => ({
      textoalternativa: txt,
      total_respuestas: tot,
    }));
    if (!data.length) {
      return (
        <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>
      );
    }

    const labels = data.map((d) => d.textoalternativa);
    const values = data.map((d) => d.total_respuestas);
    const tipo = tipoGraficoPorPregunta(pregunta.idpregunta);

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

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const title = "Resumen de Respuestas";
    const fecha = new Date();
    const fechaStr = `${String(fecha.getDate()).padStart(2, "0")}/${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}/${fecha.getFullYear()}`;
    const marginY = 28;
    let currentY = marginY;

    function drawHeader() {
      pdf.setFontSize(14);
      pdf.setTextColor(40);
      pdf.text(title, 105, 10, { align: "center" });
      pdf.setFontSize(10);
      pdf.setTextColor(80);
      pdf.text(`Fecha: ${fechaStr}`, 14, 16);
      pdf.text(`Sesión: ${filtroSesion || "General"}`, 14, 21);
      pdf.text(`Participantes: ${totalParticipantes}`, 14, 26);
    }

    // Dibujamos la cabecera solo una vez, al inicio
    drawHeader();

    preguntas
      .filter((p) => !preguntasExcluidas.includes(p.idpregunta))
      .forEach((pregunta) => {
        const resp = getRespuestasParaPregunta(pregunta.idpregunta);
        const altTexto = alternativasData[pregunta.idpregunta] || {};
        const mapa = Object.entries(altTexto).reduce((acc, [id, txt]) => {
          const encontrada = resp.find((r) => r.idalternativa === Number(id));
          const total = encontrada ? Number(encontrada.total_respuestas) : 0;
          const key = txt.toLowerCase().includes("no aplica")
            ? "No Aplica"
            : txt;
          acc[key] = (acc[key] || 0) + total;
          return acc;
        }, {});

        resp.forEach((r) => {
          if (!altTexto[r.idalternativa]) {
            const txt = getTextoAlternativa(
              pregunta.idpregunta,
              r.idalternativa
            );
            const key = txt.toLowerCase().includes("no aplica")
              ? "No Aplica"
              : txt;
            mapa[key] = (mapa[key] || 0) + Number(r.total_respuestas);
          }
        });

        const totalFinal = Object.values(mapa).reduce((a, b) => a + b, 0);
        const rows = Object.entries(mapa).map(([texto, total]) => {
          const porcentaje =
            totalFinal > 0
              ? ((total / totalFinal) * 100).toFixed(1) + "%"
              : "0%";
          return [texto, total.toString(), porcentaje];
        });
        if (!rows.length) return;

        autoTable(pdf, {
          startY: currentY + 5,
          head: [[pregunta.textopregunta, "Total", "%"]],
          body: rows,
          margin: { left: 14, right: 14 },
          styles: { fontSize: 9 },
          headStyles: { fillColor: [41, 128, 185], halign: "center" },
          columnStyles: {
            1: { halign: "center" },
            2: { halign: "center" },
          },
          // Solo actualizamos currentY; NO volvemos a dibujar la cabecera
          didDrawPage: (data) => {
            currentY = data.cursor.y;
          },
        });

        currentY += 10;
        if (currentY >= 260) {
          pdf.addPage();
          currentY = marginY;
        }
      });

    pdf.save("resumen-respuestas.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8">
      <Button
        onPress={() => navigate(-1)}
        className="flex mb-4 items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </Button>
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
          <div className="flex justify-between items-center mt-6 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Resumen del Cuestionario
            </h1>
            <button
              onClick={handleExportPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              Exportar PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <p className="ml-3 text-gray-600">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
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
