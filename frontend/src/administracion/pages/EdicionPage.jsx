import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Save,
  ArrowLeft,
  Check,
  X,
  Edit,
  Plus,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  actualizarCuestionarioRequest,
  getCuestionarioPorIdRequest,
} from "../../api/cuestionarios";
import {
  getPreguntasPorCuestionarioRequest,
  getTipoPreguntaRequest,
  eliminarPreguntaRequest,
  actualizarPreguntaRequest,
  crearPreguntaRequest,
} from "../../api/preguntas";
import {
  getAlternativasPorPreguntaRequest,
  actualizarAlternativaRequest,
  eliminarAlternativaRequest,
  crearAlternativaRequest,
} from "../../api/alternativas";
import { useAlert } from "../../shared/context/AlertContext";

const EdicionPage = () => {
  const { idcuestionario } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [cuestionario, setCuestionario] = useState({
    titulocuestionario: "",
    descripcioncuestionario: "",
    estadocuestionario: "",
  });

  const [preguntas, setPreguntas] = useState([]);
  const [alternativasPorPregunta, setAlternativasPorPregunta] = useState({});
  const [tiposPreguntas, setTiposPreguntas] = useState([]);

  const [preguntaEditando, setPreguntaEditando] = useState(null);
  const [alternativaEditando, setAlternativaEditando] = useState(null);

  const [nuevaPregunta, setNuevaPregunta] = useState({
    textopregunta: "",
    tipopregunta: "",
  });
  const [nuevaAlternativa, setNuevaAlternativa] = useState({
    textoalternativa: "",
    caracteristicaalternativa: "",
    idpregunta: null,
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const onBack = () => {
    navigate(-1); // Navega a la página anterior
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos del cuestionario
        const responseCuestionario = await getCuestionarioPorIdRequest(
          idcuestionario
        );
        if (responseCuestionario.status === 404) {
          setError("Cuestionario no encontrado.");
          return;
        }
        setCuestionario(responseCuestionario.data);

        // Obtener los tipos de pregunta
        const responseTipos = await getTipoPreguntaRequest();
        setTiposPreguntas(responseTipos.data);
        // Establecer el valor inicial de tipopregunta
        if (responseTipos.data.length > 0) {
          setNuevaPregunta((prev) => ({
            ...prev,
            tipopregunta: responseTipos.data[0].tipopregunta, // Primer elemento del select
          }));
        }

        // Obtener preguntas del cuestionario
        const responsePreguntas = await getPreguntasPorCuestionarioRequest(
          idcuestionario
        );
        setPreguntas(responsePreguntas.data);

        // Obtener alternativas para cada pregunta
        const alternativasTemp = {};
        for (const pregunta of responsePreguntas.data) {
          const responseAlternativas = await getAlternativasPorPreguntaRequest(
            pregunta.idpregunta
          );
          alternativasTemp[pregunta.idpregunta] = responseAlternativas.data;
        }
        setAlternativasPorPregunta(alternativasTemp);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Error interno del servidor. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idcuestionario]);

  // Actualizar título del cuestionario
  const actualizarTitulo = (nuevoTitulo) => {
    setCuestionario({
      ...cuestionario,
      titulo: nuevoTitulo,
    });
  };

  const handlePreguntaChange = (e, idpregunta) => {
    const { name, value } = e.target;
    setPreguntas(
      preguntas.map((p) =>
        p.idpregunta === idpregunta ? { ...p, [name]: value } : p
      )
    );
  };

  const handleAlternativaChange = (e, idpregunta, idalternativa) => {
    const { name, value } = e.target;
    setAlternativasPorPregunta({
      ...alternativasPorPregunta,
      [idpregunta]: alternativasPorPregunta[idpregunta].map((a) =>
        a.idalternativa === idalternativa ? { ...a, [name]: value } : a
      ),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCuestionario((prev) => ({ ...prev, [name]: value }));
  };

  const handleNuevaPreguntaChange = (e) => {
    const { name, value } = e.target;
    setNuevaPregunta((prev) => ({ ...prev, [name]: value }));
  };

  const handleNuevaAlternativaChange = (e) => {
    const { name, value } = e.target;
    setNuevaAlternativa((prev) => ({ ...prev, [name]: value }));
  };

  const eliminarPregunta = async (idpregunta) => {
    try {
      const response = await eliminarPreguntaRequest(idpregunta);

      if (response.status === 200 || response.status === 204) {
        setPreguntas(preguntas.filter((p) => p.idpregunta !== idpregunta));

        // Eliminar también las alternativas asociadas
        const nuevoAlternativasPorPregunta = { ...alternativasPorPregunta };
        delete nuevoAlternativasPorPregunta[idpregunta];
        setAlternativasPorPregunta(nuevoAlternativasPorPregunta);

        showAlert("Pregunta eliminada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al eliminar pregunta:", err);
      showAlert("Error al eliminar la pregunta", "warning");
    }
  };

  const eliminarAlternativa = async (idpregunta, idalternativa) => {
    try {
      const response = await eliminarAlternativaRequest(idalternativa);

      if (response.status === 200 || response.status === 204) {
        setAlternativasPorPregunta({
          ...alternativasPorPregunta,
          [idpregunta]: alternativasPorPregunta[idpregunta].filter(
            (a) => a.idalternativa !== idalternativa
          ),
        });
        showAlert("Alternativa eliminada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al eliminar alternativa:", err);
      showAlert("Error al eliminar la alternativa", "warning");
    }
  };

  const actualizarAlternativa = async (idpregunta, idalternativa) => {
    try {
      const alternativaActualizar = alternativasPorPregunta[idpregunta].find(
        (a) => a.idalternativa === idalternativa
      );
      const response = await actualizarAlternativaRequest(
        idalternativa,
        alternativaActualizar
      );

      if (response.status === 200) {
        setAlternativaEditando(null);
        showAlert("Alternativa actualizada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al actualizar alternativa:", err);
      showAlert("Error al actualizar la alternativa", "warning");
    }
  };

  const agregarAlternativa = async (idpregunta) => {
    try {
      const nuevaAlternativaData = {
        ...nuevaAlternativa,
        idpregunta,
      };

      console.log(nuevaAlternativaData);
      const response = await crearAlternativaRequest(nuevaAlternativaData);

      if (response.status === 201) {
        const alternativaCreada = response.data;
        setAlternativasPorPregunta({
          ...alternativasPorPregunta,
          [idpregunta]: [
            ...alternativasPorPregunta[idpregunta],
            alternativaCreada,
          ],
        });
        setNuevaAlternativa({
          textoalternativa: "",
          caracteristicaalternativa: "",
          idpregunta: null,
        });
        showAlert("Alternativa agregada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al agregar alternativa:", err);
      showAlert("Error al agregar la alternativa", "warning");
    }
  };

  const agregarPregunta = async () => {
    try {
      const nuevaPreguntaData = {
        ...nuevaPregunta,
        idcuestionario: Number.parseInt(idcuestionario),
      };

      const response = await crearPreguntaRequest(nuevaPreguntaData);

      if (response.status === 201) {
        const preguntaCreada = response.data;
        setPreguntas([...preguntas, preguntaCreada]);
        setAlternativasPorPregunta({
          ...alternativasPorPregunta,
          [preguntaCreada.idpregunta]: [],
        });
        setNuevaPregunta({
          textopregunta: "",
          tipopregunta: "",
        });
        showAlert("Pregunta agregada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al agregar pregunta:", err);
      showAlert("Error al agregar la pregunta", "warning");
    }
  };

  const actualizarPregunta = async (idpregunta) => {
    try {
      const preguntaActualizar = preguntas.find(
        (p) => p.idpregunta === idpregunta
      );
      const response = await actualizarPreguntaRequest(
        idpregunta,
        preguntaActualizar
      );

      if (response.status === 200) {
        setPreguntaEditando(null);
        showAlert("Pregunta actualizada exitosamente", "success");
      }
    } catch (err) {
      console.error("Error al actualizar pregunta:", err);
      showAlert("Error al actualizar la pregunta", "warning");
    }
  };

  const guardarCuestionario = async () => {
    try {
      setGuardando(true);
      const response = await actualizarCuestionarioRequest(
        idcuestionario,
        cuestionario
      );

      if (response.status === 200 || response.status === 204) {
        setMensaje("Cuestionario guardado correctamente");
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError("No se pudo actualizar el cuestionario");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error al guardar el cuestionario:", err);
      setError("Error al guardar el cuestionario");
      setTimeout(() => setError(null), 3000);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mr-4"></div>
          <p className="text-gray-600 text-lg">
            Cargando información del cuestionario...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto h-screen bg-gray-50 px-4 py-6">
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Volver
        </button>
        <h1 className="text-2xl font-bold">Editar Cuestionario</h1>
        <button
          onClick={guardarCuestionario}
          disabled={guardando}
          className="flex items-center bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {guardando ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Guardar
        </button>
      </div>

      {/* Mensajes de error o éxito */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {mensaje && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{mensaje}</span>
          <button onClick={() => setMensaje(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Información del cuestionario */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Información del Cuestionario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Título del Cuestionario
            </label>
            <input
              type="text"
              name="titulocuestionario"
              value={cuestionario.titulocuestionario}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el título del cuestionario"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Estado
            </label>
            <select
              name="estadocuestionario"
              value={cuestionario.estadocuestionario}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Descripción
          </label>
          <textarea
            name="descripcioncuestionario"
            value={cuestionario.descripcioncuestionario}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese una descripción para el cuestionario"
            rows="3"
          ></textarea>
        </div>
      </div>

      {/* Agregar nueva pregunta */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="font-semibold mb-3 text-xl">Agregar nueva pregunta</h2>
        <div className="flex flex-col gap-4">
          {/* Contenedor para el texto de la pregunta */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-2">
              Texto de la pregunta
            </label>
            <input
              type="text"
              placeholder="Texto de la pregunta"
              value={nuevaPregunta.textopregunta}
              onChange={(e) => handleNuevaPreguntaChange(e)}
              name="textopregunta"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contenedor para el tipo de alternativas */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-medium mb-2">
              Tipo de alternativas
            </label>
            <select
              value={nuevaPregunta.tipopregunta}
              onChange={(e) => handleNuevaPreguntaChange(e)}
              name="tipopregunta"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tiposPreguntas.map((tipo) => {
                const tipoAmigable = {
                  checkbox: "Casilla de verificación",
                  enunciado: "Texto de enunciado",
                  number: "Número",
                  radio: "Botón de opción",
                  range: "Rango deslizante",
                  select: "Lista desplegable",
                  text: "Campo de texto",
                };

                return (
                  <option key={tipo.tipopregunta} value={tipo.tipopregunta}>
                    {tipoAmigable[tipo.tipopregunta] || tipo.tipopregunta}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Botón para agregar la pregunta */}
          <button
            onClick={agregarPregunta}
            disabled={
              !nuevaPregunta.textopregunta || !nuevaPregunta.tipopregunta
            } // Asegúrate de que ambos campos estén completos
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar
          </button>
        </div>
      </div>

      {/* Preguntas y alternativas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preguntas ya existentes</h2>
          <span className="text-gray-500 text-sm">
            Total: {preguntas.length} preguntas
          </span>
        </div>

        {/* Lista de preguntas */}
        <div className="space-y-6">
          {preguntas.map((pregunta) => (
            <div key={pregunta.idpregunta} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  {preguntaEditando === pregunta.idpregunta ? (
                    <div className="mb-2">
                      <input
                        type="text"
                        name="textopregunta"
                        value={pregunta.textopregunta}
                        onChange={(e) =>
                          handlePreguntaChange(e, pregunta.idpregunta)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex mt-2">
                        <select
                          name="tipopregunta"
                          value={pregunta.tipopregunta}
                          onChange={(e) =>
                            handlePreguntaChange(e, pregunta.idpregunta)
                          }
                          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                        >
                          {tiposPreguntas.map((tipo, index) => (
                            <option key={index} value={tipo.tipopregunta}>
                              {tipo.tipopregunta}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            actualizarPregunta(pregunta.idpregunta)
                          }
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md mr-2"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPreguntaEditando(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <h3 className="font-medium text-lg">
                        {pregunta.textopregunta}
                      </h3>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {
                          tiposPreguntas.find(
                            (t) => t.tipopregunta === pregunta.tipopregunta
                          )?.tipopregunta
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex">
                  {preguntaEditando !== pregunta.idpregunta && (
                    <button
                      onClick={() => setPreguntaEditando(pregunta.idpregunta)}
                      className="text-blue-600 hover:text-blue-800 p-1 mr-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarPregunta(pregunta.idpregunta)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Alternativas */}
              <div className="ml-4 mt-3">
                <ul className="space-y-2">
                  {alternativasPorPregunta[pregunta.idpregunta]?.map(
                    (alternativa) => (
                      <li
                        key={alternativa.idalternativa}
                        className="flex items-center justify-between"
                      >
                        {alternativaEditando === alternativa.idalternativa ? (
                          <div className="flex-1 flex items-center">
                            <input
                              type="text"
                              name="textoalternativa"
                              value={alternativa.textoalternativa}
                              onChange={(e) =>
                                handleAlternativaChange(
                                  e,
                                  pregunta.idpregunta,
                                  alternativa.idalternativa
                                )
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                            />
                            <input
                              type="text"
                              name="caracteristicaalternativa"
                              value={alternativa.caracteristicaalternativa}
                              onChange={(e) =>
                                handleAlternativaChange(
                                  e,
                                  pregunta.idpregunta,
                                  alternativa.idalternativa
                                )
                              }
                              className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                              placeholder="Valor"
                            />
                            <button
                              onClick={() =>
                                actualizarAlternativa(
                                  pregunta.idpregunta,
                                  alternativa.idalternativa
                                )
                              }
                              className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-md mr-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setAlternativaEditando(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white p-1 rounded-md"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center">
                              <span className="text-gray-800">
                                {alternativa.textoalternativa}
                              </span>
                              {alternativa.caracteristicaalternativa && (
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  {alternativa.caracteristicaalternativa}
                                </span>
                              )}
                            </div>
                            <div className="flex">
                              <button
                                onClick={() =>
                                  setAlternativaEditando(
                                    alternativa.idalternativa
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 p-1 mr-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  eliminarAlternativa(
                                    pregunta.idpregunta,
                                    alternativa.idalternativa
                                  )
                                }
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    )
                  )}
                </ul>

                {/* Agregar nueva alternativa */}
                <div className="mt-3 flex items-center">
                  <input
                    type="text"
                    placeholder="Texto de la alternativa"
                    value={
                      nuevaAlternativa.idpregunta === pregunta.idpregunta
                        ? nuevaAlternativa.textoalternativa
                        : ""
                    }
                    onChange={(e) =>
                      setNuevaAlternativa({
                        ...nuevaAlternativa,
                        textoalternativa: e.target.value,
                        idpregunta: pregunta.idpregunta,
                      })
                    }
                    className="w-2/3 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  />
                  <input
                    type="text"
                    placeholder="Característica asociada"
                    value={
                      nuevaAlternativa.idpregunta === pregunta.idpregunta
                        ? nuevaAlternativa.caracteristicaalternativa
                        : ""
                    }
                    onChange={(e) =>
                      setNuevaAlternativa({
                        ...nuevaAlternativa,
                        caracteristicaalternativa: e.target.value,
                        idpregunta: pregunta.idpregunta,
                      })
                    }
                    className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                  />
                  <button
                    onClick={() => agregarAlternativa(pregunta.idpregunta)}
                    disabled={
                      !nuevaAlternativa.textoalternativa ||
                      nuevaAlternativa.idpregunta !== pregunta.idpregunta
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EdicionPage;
