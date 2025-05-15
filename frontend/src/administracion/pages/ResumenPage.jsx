import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getPreguntasPorCuestionarioRequest } from "../../api/preguntas";
import {
  getTotalAlternativasRespondidasRequest,
  getAlternativasPorPreguntaRequest,
} from "../../api/alternativas";
import { getRespuestasPorCodigoRequest } from "../../api/respuestas";
import { getSesionesPorCuestionarioRequest } from "../../api/sesiones";

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

const agruparRespuestasPorPregunta = (respuestas) => {
  const agrupadas = {};
  respuestas.forEach(({ idpregunta, idalternativa }) => {
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
  const [nombreSesionVisible, setNombreSesionVisible] = useState("");
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [alternativasData, setAlternativasData] = useState({});
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const preguntasResponse = await getPreguntasPorCuestionarioRequest(idcuestionario);
        const preguntasFiltradas = preguntasResponse.data.map((p) => ({
          idpregunta: p.idpregunta,
          textopregunta: p.textopregunta,
        }));
        setPreguntas(preguntasFiltradas);

        const sesionesResponse = await getSesionesPorCuestionarioRequest(idcuestionario);
        setSesiones(sesionesResponse.data || []);

        const alternativasPorPregunta = {};
        const alternativasRequests = preguntasFiltradas.map(async (pregunta) => {
          const response = await getAlternativasPorPreguntaRequest(pregunta.idpregunta);
          alternativasPorPregunta[pregunta.idpregunta] = response.data.reduce(
            (acc, alt) => {
              acc[alt.idalternativa] = alt.textoalternativa;
              return acc;
            },
            {}
          );
        });
        await Promise.all(alternativasRequests);
        setAlternativasData(alternativasPorPregunta);

        if (filtroSesion && filtroSesion.trim() !== "") {
          const respuesta = await getRespuestasPorCodigoRequest(filtroSesion);
          const { data } = respuesta;

          const sesionEncontrada = sesionesResponse.data.find(
            (s) => s.codigosesion === filtroSesion
          );
          setNombreSesionVisible(sesionEncontrada?.nombresesion || "Sin nombre");

          const participantesUnicos = new Set(data.map((r) => r.idpersona)).size;
          setTotalParticipantes(participantesUnicos);

          const agrupadas = agruparRespuestasPorPregunta(data);
          setRespuestasPorPregunta(agrupadas);
        } else {
          const respuesta = await getTotalAlternativasRespondidasRequest();
          setRespuestasPorPregunta(respuesta.data);
          setNombreSesionVisible("General");
          setTotalParticipantes(0);
        }
      } catch (err) {
        if (err.response.status === 404) {
          setError("Esta sesión no contiene respuestas."); // Mensaje personalizado para 404
        } else {
          setError(err.message || "Error al cargar los datos");
        }
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
    const labels = respuestas.map((r) =>
      getTextoAlternativa(pregunta.idpregunta, r.idalternativa)
    );
    const values = respuestas.map((r) => Number(r.total_respuestas));
    const tipo = tipoGraficoPorPregunta(pregunta.idpregunta);

    if (values.length === 0) {
      return <p className="text-gray-500 text-sm">No hay datos para mostrar.</p>;
    }

    switch (tipo) {
      case "pie":
        return <SimpleChart labels={labels} series={values} />;
      case "column":
        return <ColumnChart series={[{ name: "Respuestas", data: values }]} categories={labels} />;
      case "radar":
        return <RadarChart series={[{ name: "Respuestas", data: values }]} categories={labels} />;
      case "angle":
        return <AngleChart series={values} labels={labels} />;
      default:
        return null;
    }
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const title = "Resumen de Respuestas";
    const fecha = new Date();
    const fechaStr = `${String(fecha.getDate()).padStart(2, '0')}/${
      String(fecha.getMonth() + 1).padStart(2, '0')
    }/${fecha.getFullYear()}`;

    const marginY = 28;
    let currentY = marginY;

    const drawHeader = () => {
      pdf.setFontSize(14);
      pdf.setTextColor(40);
      pdf.text(title, 105, 10, { align: "center" });

      pdf.setFontSize(10);
      pdf.setTextColor(80);
      pdf.text(`Fecha: ${fechaStr}`, 14, 16);
      pdf.text(`Sesión: ${nombreSesionVisible}`, 14, 21);
      pdf.text(`Participantes: ${totalParticipantes}`, 14, 26);
    };

    drawHeader();

    preguntas
      .filter((p) => !preguntasExcluidas.includes(p.idpregunta))
      .forEach((pregunta) => {
        const respuestas = getRespuestasParaPregunta(pregunta.idpregunta);
        const totalRespuestas = getTotalRespuestasPregunta(pregunta.idpregunta);

        const rows = respuestas.map((r) => {
          const texto = getTextoAlternativa(pregunta.idpregunta, r.idalternativa);
          const total = r.total_respuestas;
          const porcentaje = totalRespuestas > 0
            ? ((total / totalRespuestas) * 100).toFixed(1) + "%"
            : "0%";
          return [texto, total.toString(), porcentaje];
        });

        if (rows.length === 0) return;

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
          didDrawPage: (data) => {
            currentY = data.cursor.y;
            drawHeader();
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
      <div className="max-w-screen-lg mx-auto">
        <FiltroSesion
          onChange={setFiltroSesion}
          idcuestionario={idcuestionario}
        />

        <div className="flex justify-between items-center mt-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Resumen del Cuestionario</h1>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Exportar PDF
          </button>
        </div>

        {filtroSesion && (
          <p className="text-sm text-gray-500 mb-4">
            Mostrando resultados para la sesión: <strong>{nombreSesionVisible}</strong>
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Cargando...</p>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {preguntas
              .filter((p) => !preguntasExcluidas.includes(p.idpregunta))
              .map((pregunta) => (
                <div
                  key={pregunta.idpregunta}
                  className="bg-white shadow rounded p-4 border-l-4 border-blue-500"
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {pregunta.textopregunta}
                  </h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Total de respuestas: {getTotalRespuestasPregunta(pregunta.idpregunta)}
                  </p>
                  {renderChart(pregunta)}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumenPage;
