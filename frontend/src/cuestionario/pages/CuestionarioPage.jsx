import { useContext, useState, useEffect, useCallback } from "react";
import { FormContext } from "../context/FormContext";
import Inicio from "../components/Inicio";
import Carga from "../components/Carga";
import RenderizarPreguntas from "../components/RenderizarPreguntas";
import BotonesNavegacion from "../components/BotonesNavegacion";
import { useCuestionario } from "../hooks/useCuestionario";
import { useInicializarAlternativas } from "../hooks/useInicializarAlternativas";
import { useManejoEnvio } from "../hooks/useManejoEnvio";
import { validateCurrentInput } from "../utils/handlesCuestionario";
import {
  handleNextSeccion,
  handlePrevSeccion,
} from "../utils/navegacionCuestionario";
import SeccionesCuestionario from "../components/SeccionesCuestionario";
import Final from "../components/Final";
import InputCodigoSesion from "../components/InputCodigoSesion";

const CuestionarioPage = () => {
  const {
    setUserData,
    userData,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    submitData,
  } = useContext(FormContext);

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [seccionActual, setSeccionActual] = useState("a");
  const nombresSecciones = ["a", "b", "c"];
  const [sessionCode, setSessionCode] = useState(null);
  const [showInputCodigoSesion, setShowInputCodigoSesion] = useState(false);

  // Estados de error
  const [startQuizError, setStartQuizError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [numberError, setNumberError] = useState("");

  const { isSubmitting, submitSuccess, submitError, handleSendQuiz } =
    useManejoEnvio(submitData, sessionCode);

  const { preguntas, alternativas, isLoading, loadError } = useCuestionario(1);

  useInicializarAlternativas(
    preguntas,
    currentQuestionIndex,
    alternativas,
    userData,
    setUserData
  );

  const handleStartQuiz = () => {
    if (aceptaTerminos) {
      setShowInputCodigoSesion(true);
      setStartQuizError("");
    } else {
      setStartQuizError(
        "Debes aceptar los términos y condiciones para continuar."
      );
    }
  };

  const handleSessionCodeValidated = (code) => {
    setSessionCode(code);
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
  };

  const validateCurrentInputWrapper = useCallback(() => {
    validateCurrentInput(
      preguntas,
      currentQuestionIndex,
      userData,
      1, // Mínimo
      80, // Máximo
      setNumberError
    );
  }, [preguntas, currentQuestionIndex, userData]);

  useEffect(() => {
    setCheckboxError("");
    setNumberError("");
    setStartQuizError("");
    validateCurrentInputWrapper();
  }, [currentQuestionIndex, preguntas, validateCurrentInputWrapper]);

  // Verificar si todas las preguntas visibles de la sección actual están respondidas
  const isSeccionCompleta = () => {
    const secciones = SeccionesCuestionario();

    const preguntasVisibles = preguntas.filter((pregunta) => {
      const perteneceASeccion = secciones[seccionActual]?.includes(
        pregunta.idpregunta
      );

      // Aplicar condiciones de preguntas dependientes
      if (pregunta.idpregunta >= 2 && pregunta.idpregunta <= 7) {
        return userData[1] === 1 && perteneceASeccion;
      }
      if (
        pregunta.idpregunta === 9 ||
        pregunta.idpregunta === 10 ||
        pregunta.idpregunta === 11
      ) {
        return userData[7] === 40 && perteneceASeccion;
      }
      if (pregunta.idpregunta === 26) {
        return userData[25] === 102 && perteneceASeccion;
      }
      return perteneceASeccion;
    });

    // Filtrar preguntas que no son de tipo "enunciado"
    const preguntasRequeridas = preguntasVisibles.filter(
      (pregunta) => pregunta.tipopregunta !== "enunciado"
    );

    // Verificar si todas las preguntas requeridas están respondidas y son válidas
    const todasRespondidas = preguntasRequeridas.every((pregunta) => {
      if (pregunta.tipopregunta === "number") {
        const value = userData[pregunta.idpregunta];
        return (
          value !== undefined && !isNaN(value) && value >= 1 && value <= 39
        );
      }
      return userData[pregunta.idpregunta] !== undefined;
    });

    return todasRespondidas;
  };

  return (
    <div className="flex flex-col min-min-h-screen ">
      <div className="flex-grow flex items-center justify-center p-6 sm:p-8">
        <div className="bg-white rounded-lg w-full max-w-4xl p-6 sm:p-8">
          <Carga isLoading={isLoading} loadError={loadError} />
          {!isLoading && !loadError && (
            <>
              {!isQuizStarted ? (
                <>
                  {!showInputCodigoSesion ? (
                    <Inicio
                      aceptaTerminos={aceptaTerminos}
                      setAceptaTerminos={setAceptaTerminos}
                      handleStartQuiz={handleStartQuiz}
                      startQuizError={startQuizError}
                      setStartQuizError={setStartQuizError}
                    />
                  ) : (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-center">
                        Código de Sesión
                      </h2>
                      <p className="text-gray-600 text-center">
                        Si estás realizando este cuestionario como parte de un
                        grupo o evento, ingresa el código proporcionado por tu
                        instructor.
                      </p>
                      <InputCodigoSesion
                        onCodeValidated={handleSessionCodeValidated}
                        isOptional={true}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {submitSuccess ? (
                    <Final submitSuccess={submitSuccess} />
                  ) : (
                    <>
                      {sessionCode && (
                        <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-blue-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                Estás respondiendo con el código de sesión:{" "}
                                <strong>{sessionCode}</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <RenderizarPreguntas
                        preguntas={preguntas}
                        alternativas={alternativas}
                        seccionActual={seccionActual}
                        userData={userData}
                        setUserData={setUserData}
                        checkboxError={checkboxError}
                        setCheckboxError={setCheckboxError}
                        numberError={numberError}
                        setNumberError={setNumberError}
                        submitError={submitError}
                      />

                      <div className="flex justify-between mt-6">
                        <BotonesNavegacion
                          currentQuestionIndex={nombresSecciones.indexOf(
                            seccionActual
                          )}
                          totalQuestions={nombresSecciones.length}
                          handleNext={() => {
                            if (isSeccionCompleta()) {
                              handleNextSeccion(
                                seccionActual,
                                setSeccionActual,
                                nombresSecciones
                              );
                            }
                          }}
                          handlePrev={() =>
                            handlePrevSeccion(
                              seccionActual,
                              setSeccionActual,
                              nombresSecciones
                            )
                          }
                          handleSendQuiz={handleSendQuiz}
                          hasError={!isSeccionCompleta()}
                          isSubmitting={isSubmitting}
                          isLastQuestion={
                            seccionActual ===
                            nombresSecciones[nombresSecciones.length - 1]
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CuestionarioPage;
