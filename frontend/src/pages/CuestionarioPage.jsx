import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FormContext } from "../context/FormContext";
import CircularProgress from "@mui/material/CircularProgress";

const CuestionarioPage = () => {
  const {
    setUserData,
    userData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    submitData,
  } = useContext(FormContext);

  const [preguntas, setPreguntas] = useState([]);
  const [alternativas, setAlternativas] = useState({});
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  // Estados para mensajes de error y éxito
  const [startQuizError, setStartQuizError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [numberError, setNumberError] = useState(""); // Nuevo estado para errores de número
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Estado para manejo de carga y errores de carga
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Estado para manejo de envío
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores constantes para el rango de edades
  const MIN_NUMBER = 18;
  const MAX_NUMBER = 80;

  // Cargar preguntas y alternativas desde el backend
  useEffect(() => {
    const cargarPreguntasYAlternativas = async () => {
      try {
        const responsePreguntas = await fetch(
          "http://localhost:4000/preguntas"
        );
        let dataPreguntas = await responsePreguntas.json();

        // Ordenar preguntas por idPregunta de forma ascendente
        dataPreguntas = dataPreguntas.sort(
          (a, b) => a.idPregunta - b.idPregunta
        );

        const responseAlternativas = await fetch(
          "http://localhost:4000/alternativas"
        );
        const dataAlternativas = await responseAlternativas.json();

        // Verificar que cada alternativa tenga un idPregunta y agruparlas
        const alternativasPorPregunta = dataAlternativas.reduce(
          (acc, alternativa) => {
            const idPregunta = alternativa.idPregunta;
            if (idPregunta) {
              if (!acc[idPregunta]) acc[idPregunta] = [];
              acc[idPregunta].push(alternativa);
            }
            return acc;
          },
          {}
        );

        setPreguntas(dataPreguntas);
        setAlternativas(alternativasPorPregunta);
        setIsLoading(false); // Finalizar carga
      } catch (error) {
        console.error("Error al cargar las preguntas y alternativas:", error);
        setLoadError(
          "Hubo un problema al cargar el cuestionario. Por favor, intenta nuevamente más tarde."
        );
        setIsLoading(false); // Finalizar carga incluso en error
      }
    };
    cargarPreguntasYAlternativas();
  }, []);

  // Este efecto se activa cada vez que cambia la pregunta actual
  useEffect(() => {
    const pregunta = preguntas[currentQuestionIndex];
    if (pregunta && pregunta.tipo === "range") {
      const idPregunta = pregunta.idPregunta;
      const opciones = alternativas[idPregunta];

      if (opciones && opciones.length > 0) {
        const primeraOpcionId = opciones[0].idAlternativa;

        // Si aún no hay valor para esta pregunta en userData, almacena la primera opción
        if (!userData[idPregunta]) {
          setUserData((prevUserData) => ({
            ...prevUserData,
            [idPregunta]: primeraOpcionId,
          }));
        }
      }
    }
  }, [currentQuestionIndex, preguntas, alternativas, userData, setUserData]);

  const handleStartQuiz = () => {
    if (aceptaTerminos) {
      setIsQuizStarted(true);
      setCurrentQuestionIndex(0);
      setStartQuizError("");
    } else {
      setStartQuizError(
        "Debes aceptar los términos y condiciones para continuar."
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < preguntas.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Manejar cambios en inputs de tipo radio y select
  const handleInputChange = (e) => {
    const idPregunta = preguntas[currentQuestionIndex].idPregunta;
    const value = parseInt(e.target.value, 10); // Convertir a número
    setUserData({
      ...userData,
      [idPregunta]: value, // idAlternativa como número
    });

    // Limpiar mensajes de error
    if (startQuizError) setStartQuizError("");
    if (submitError) setSubmitError("");
  };

  // Manejar cambios en inputs de tipo checkbox
  const handleCheckboxChange = (e) => {
    const idPregunta = preguntas[currentQuestionIndex].idPregunta;
    const selectedId = parseInt(e.target.value, 10); // Convertir a número
    const updatedSelections = userData[idPregunta] || [];

    // Limitar la selección a 2 para la pregunta 8 (ajusta según tus necesidades)
    if (idPregunta === 8 && updatedSelections.length >= 2 && e.target.checked) {
      setCheckboxError(
        "Puedes seleccionar un máximo de 2 opciones para esta pregunta."
      );
      return; // No permite seleccionar más de 2 opciones
    }

    let newSelections;
    if (e.target.checked) {
      newSelections = [...updatedSelections, selectedId];
      setCheckboxError("");
    } else {
      newSelections = updatedSelections.filter((id) => id !== selectedId);
    }

    setUserData({
      ...userData,
      [idPregunta]: newSelections,
    });

    // Limpiar mensajes de error
    if (submitError) setSubmitError("");
  };
  // Manejar cambios en inputs de tipo range
  const handleRangeChange = (e, idPregunta) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const opciones = alternativas[idPregunta] || [];
    const selectedAlternativa = opciones[selectedIndex];

    setUserData({
      ...userData,
      [idPregunta]: selectedAlternativa
        ? selectedAlternativa.idAlternativa
        : null,
    });

    // Limpiar mensajes de error
    if (submitError) setSubmitError("");
  };

  const validateCurrentInput = useCallback(() => {
    const pregunta = preguntas[currentQuestionIndex];
    if (!pregunta) return;

    if (pregunta.tipo === "number") {
      const value = userData[pregunta.idPregunta];
      if (value !== undefined && value !== "") {
        if (value < MIN_NUMBER) {
          setNumberError(`El número debe ser al menos ${MIN_NUMBER}.`);
        } else if (value > MAX_NUMBER) {
          setNumberError(`El número no puede exceder ${MAX_NUMBER}.`);
        } else {
          setNumberError(""); // Limpiar error si el valor es válido
        }
      } else {
        setNumberError(""); // Limpiar error si el campo está vacío
      }
    }

    // Puedes agregar más validaciones para otros tipos si es necesario
  }, [preguntas, currentQuestionIndex, userData, MIN_NUMBER, MAX_NUMBER]);

  // Manejar el envío del cuestionario
  const handleSendQuiz = async () => {
    setIsSubmitting(true);
    try {
      submitData(); // Asumiendo que submitData retorna una promesa
      setSubmitSuccess(true);
      setSubmitError("");
    } catch (error) {
      console.error("Error al enviar el cuestionario:", error);
      setSubmitError(
        "Hubo un problema al enviar el cuestionario. Por favor, intenta nuevamente."
      );
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const pregunta = preguntas[currentQuestionIndex];
    if (!pregunta) return null;

    const opciones = (alternativas[pregunta.idPregunta] || []).sort((a, b) => {
      const textoA = a.textoAlternativa || "";
      const textoB = b.textoAlternativa || "";
      const isNumeric =
        !isNaN(parseFloat(textoA)) && !isNaN(parseFloat(textoB));

      if (isNumeric) {
        return parseFloat(textoA) - parseFloat(textoB);
      } else {
        return textoA.localeCompare(textoB);
      }
    });

    return (
      <div className="w-full transition-opacity duration-300 ease-in-out">
        <h2 className="text-xl text-center sm:text-2xl font-semibold mb-4 text-Moonstone">
          {pregunta.textoPregunta}
        </h2>

        {renderInputByType(pregunta, opciones)}

        {/* Mostrar solo submitError si existe */}
        {submitError && (
          <span className="text-red-600 text-xs sm:text-sm mt-2 block">
            {submitError}
          </span>
        )}
      </div>
    );
  };

  const renderInputByType = (pregunta, opciones) => {
    switch (pregunta.tipo) {
      case "text":
        return (
          <div className="w-full">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
              value={userData[pregunta.idPregunta] || ""}
              onChange={(e) => {
                setUserData({
                  ...userData,
                  [pregunta.idPregunta]: e.target.value,
                });
                if (startQuizError) setStartQuizError("");
                if (submitError) setSubmitError("");
              }}
              placeholder="Escribe tu respuesta"
              maxLength="200" // Limitar a 200 caracteres
            />
          </div>
        );

      case "radio":
        return (
          <div className="w-full">
            {opciones.map((opcion) => (
              <label
                key={opcion.idAlternativa}
                className="flex items-center mb-2 p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta.idPregunta}`}
                  value={opcion.idAlternativa} // idAlternativa como número
                  checked={
                    userData[pregunta.idPregunta] === opcion.idAlternativa
                  }
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                />
                <span className="text-gray-700 text-sm sm:text-base">
                  {opcion.textoAlternativa}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="w-full">
            {opciones.map((opcion) => (
              <label
                key={opcion.idAlternativa}
                className="flex items-center mb-2 p-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  value={opcion.idAlternativa} // idAlternativa como número
                  checked={(userData[pregunta.idPregunta] || []).includes(
                    opcion.idAlternativa
                  )}
                  onChange={handleCheckboxChange}
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                />
                <span className="text-gray-700 text-sm sm:text-base">
                  {opcion.textoAlternativa}
                </span>
              </label>
            ))}
            {/* Mostrar mensaje de error si existe */}
            {checkboxError && (
              <span className="text-red-600 text-xs sm:text-sm mt-2 block">
                {checkboxError}
              </span>
            )}
          </div>
        );

      case "select":
        return (
          <div className="w-full">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
              value={userData[pregunta.idPregunta] || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled hidden>
                Seleccione una opción
              </option>
              {opciones.map((opcion) => (
                <option key={opcion.idAlternativa} value={opcion.idAlternativa}>
                  {opcion.textoAlternativa}
                </option>
              ))}
            </select>
          </div>
        );

      case "range": {
        // Encontrar el índice de la alternativa seleccionada basada en idAlternativa
        const selectedId = userData[pregunta.idPregunta];
        const selectedIndex = opciones.findIndex(
          (opcion) => opcion.idAlternativa === selectedId
        );
        const selectedOption = opciones[selectedIndex];

        return (
          <div className="w-full">
            <input
              type="range"
              min="0"
              max={opciones.length - 1}
              step="1"
              value={selectedIndex !== -1 ? selectedIndex : 0}
              onChange={(e) => handleRangeChange(e, pregunta.idPregunta)}
              className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
            />

            {/* Mostrar la opción seleccionada en dispositivos pequeños */}
            {selectedOption && (
              <div className="mt-2 sm:hidden text-center text-sm text-gray-600">
                {selectedOption.textoAlternativa}
              </div>
            )}

            {/* Instrucción para dispositivos móviles */}
            <span className="sm:hidden text-sm text-gray-500 mt-2">
              Mueve el deslizador para seleccionar una opción.
            </span>

            {/* Mostrar todas las opciones en dispositivos medianos y grandes */}
            <div
              className="hidden sm:grid grid-cols-5 mt-2 sm:mt-4 text-xs sm:text-sm text-gray-600 w-full px-2"
              style={{ gridTemplateColumns: `repeat(${opciones.length}, 1fr)` }}
            >
              {opciones.map((opcion) => (
                <span
                  key={opcion.idAlternativa}
                  className="text-center p-2 break-words"
                >
                  {opcion.textoAlternativa}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case "number":
        return (
          <div className="w-full">
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-transform duration-200 ease-in-out"
              value={userData[pregunta.idPregunta] || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? "" : parseInt(e.target.value, 10);

                // Actualizar el estado con el valor ingresado
                setUserData({
                  ...userData,
                  [pregunta.idPregunta]: value,
                });

                // Validar el valor ingresado y establecer mensajes de error si es necesario
                if (value !== "") {
                  if (value < MIN_NUMBER) {
                    setNumberError(
                      `El número debe ser al menos ${MIN_NUMBER}.`
                    );
                  } else if (value > MAX_NUMBER) {
                    setNumberError(`El número no puede exceder ${MAX_NUMBER}.`);
                  } else {
                    setNumberError(""); // Limpiar error si el valor es válido
                  }
                } else {
                  setNumberError(""); // Limpiar error si el campo está vacío
                }

                // Limpiar otros mensajes de error
                if (startQuizError) setStartQuizError("");
                if (submitError) setSubmitError("");
              }}
              placeholder={`Ingresa un número`}
              min={MIN_NUMBER}
              max={MAX_NUMBER}
              step={1}
            />
            {/* Mostrar mensaje de error si existe */}
            {numberError && (
              <span className="text-red-600 text-xs sm:text-sm mt-2 block">
                {numberError}
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Limpiar mensajes de error al cambiar de pregunta y validar el input actual
  useEffect(() => {
    setCheckboxError("");
    setNumberError("");
    setSubmitError("");

    // Validar el input actual después de limpiar los errores
    validateCurrentInput();
  }, [currentQuestionIndex, preguntas, validateCurrentInput]);

  // Determinar si hay un error en la pregunta actual
  const hasError = !!checkboxError || !!numberError || !!submitError;

  return (
    <div className="flex flex-col w-screen h-screen bg-pulpo-pattern bg-YankeesBlue bg-cover bg-center bg-no-repeat p-0">
      <div className="flex justify-start mb-4">
        <Link to="/">
          <button className="bg-Moonstone rounded-full text-white font-semibold py-2 m-1 px-6 sm:py-3 sm:px-8 shadow-md transition-transform duration-200 ease-in-out transform hover:scale-105">
            Volver a Inicio
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full">
            <CircularProgress size={50} color="primary" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full">
            <p className="text-red-600 text-sm sm:text-base">{loadError}</p>
          </div>
        ) : (
          <>
            {!isQuizStarted ? (
              <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full transition-opacity duration-500 ease-in-out">
                <h3 className="font-bold text-xl sm:text-2xl text-center mb-4 text-Moonstone">
                  Términos y Condiciones
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm text-center mb-4">
                  Autorizo el uso de los datos para el proceso de investigación
                  y difusión del proyecto Wild E, que tiene por objetivo
                  fortalecer la educación en emprendimiento en instituciones de
                  educación superior de América y Europa, a través de un modelo
                  teórico y la utilización de recursos audiovisuales inspirados
                  en la naturaleza y la fauna local. He sido informado(a) de que
                  se puede hacer preguntas sobre la investigación en cualquier
                  momento y que es posible el retractar mi decisión al respecto,
                  sin tener que dar explicaciones ni sufrir consecuencia alguna
                  por tal decisión. De tener preguntas, reclamos o comentarios
                  sobre la participación en este proyecto, contactar al equipo
                  responsable Pablo Zamora (pablo.zamora@pucv.cl) y Patricia
                  Ibáñez (patricia.iban@gmail.com).
                </p>
                {startQuizError && (
                  <span className="text-red-600 text-xs sm:text-sm mb-2 block">
                    {startQuizError}
                  </span>
                )}
                <label className="flex items-center mb-4 transition-colors duration-200 ease-in-out hover:bg-gray-100 rounded-md p-2 w-full">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => {
                      setAceptaTerminos(e.target.checked);
                      if (startQuizError) setStartQuizError("");
                    }}
                    className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">
                    Acepto los términos y condiciones
                  </span>
                </label>
                <button
                  onClick={handleStartQuiz}
                  className="bg-Moonstone rounded-full text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 w-full transition-transform duration-200 ease-in-out transform hover:scale-105"
                >
                  Iniciar Cuestionario
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full transition-opacity duration-500 ease-in-out">
                {submitSuccess ? (
                  <div className="text-center transition-opacity duration-300 ease-in-out">
                    <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">
                      ¡Gracias por completar el cuestionario!
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-base">
                      Hemos recibido tus respuestas correctamente.
                    </p>
                  </div>
                ) : (
                  <>
                    {renderQuestion()}

                    <div className="flex justify-between mt-4 w-full">
                      <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`bg-gray-700 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-opacity duration-200 ease-in-out ${
                          currentQuestionIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-600 hover:scale-105"
                        }`}
                      >
                        Anterior
                      </button>

                      {currentQuestionIndex < preguntas.length - 1 ? (
                        <button
                          onClick={handleNextQuestion}
                          disabled={hasError}
                          className={`bg-Moonstone text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-transform duration-200 ease-in-out transform ${
                            hasError
                              ? "bg-Moonstone cursor-not-allowed"
                              : "hover:bg-Moonstone hover:scale-105"
                          }`}
                        >
                          Siguiente
                        </button>
                      ) : (
                        <button
                          onClick={handleSendQuiz}
                          disabled={isSubmitting || submitSuccess || hasError}
                          className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full ${
                            isSubmitting || submitSuccess || hasError
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-500 text-white transition-transform duration-200 ease-in-out transform hover:scale-105"
                          }`}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar"}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 px-4 bg-Moonstone">
        <p className="text-xs text-center sm:text-sm text-white p-2 rounded">
          La duración del cuestionario es de 20 minutos aproximadamente.
        </p>
      </div>
    </div>
  );
};

export default CuestionarioPage;
