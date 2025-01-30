import { useContext, useState, useEffect, useCallback } from "react";
import { FormContext } from "../context/FormContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
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

  // Estados para mensajes de error
  const [startQuizError, setStartQuizError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [numberError, setNumberError] = useState("");

  // Manejar el envío del cuestionario
  const { isSubmitting, submitSuccess, submitError, handleSendQuiz } =
    useManejoEnvio(submitData);

  // Valores constantes para el rango de edades
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 80;

  // Cargar preguntas y alternativas desde el backend
  const { preguntas, alternativas, isLoading, loadError } = useCuestionario(1);

  // Este efecto se activa cada vez que cambia la pregunta actual
  useInicializarAlternativas(
    preguntas,
    currentQuestionIndex,
    alternativas,
    userData,
    setUserData
  );

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

  const validateCurrentInputWrapper = useCallback(() => {
    validateCurrentInput(
      preguntas,
      currentQuestionIndex,
      userData,
      MIN_NUMBER,
      MAX_NUMBER,
      setNumberError
    );
  }, [preguntas, currentQuestionIndex, userData, MIN_NUMBER, MAX_NUMBER]);

  // Limpiar mensajes de error al cambiar de pregunta y validar el input actual
  useEffect(() => {
    setCheckboxError("");
    setNumberError("");
    setStartQuizError("");

    // Validar el input actual después de limpiar los errores
    validateCurrentInputWrapper();
  }, [currentQuestionIndex, preguntas, validateCurrentInputWrapper]);

  // Determinar si hay un error en la pregunta actual
  const hasError = !!checkboxError || !!numberError || !!submitError;

  const [seccionActual, setSeccionActual] = useState("a");
  const nombresSecciones = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <Carga isLoading={isLoading} loadError={loadError} />
        {!isLoading && !loadError && (
          <>
            {!isQuizStarted ? (
              <Inicio
                aceptaTerminos={aceptaTerminos}
                setAceptaTerminos={setAceptaTerminos}
                handleStartQuiz={handleStartQuiz}
                startQuizError={startQuizError}
                setStartQuizError={setStartQuizError}
              />
            ) : (
              <div className="justify-center bg-white rounded-3xl p-4 sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl 2xl:max-w-4xl">
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

                    <div className="flex">
                      <BotonesNavegacion
                        currentQuestionIndex={nombresSecciones.indexOf(
                          seccionActual
                        )}
                        totalQuestions={nombresSecciones.length}
                        handleNext={() =>
                          handleNextSeccion(
                            seccionActual,
                            setSeccionActual,
                            nombresSecciones
                          )
                        }
                        handlePrev={() =>
                          handlePrevSeccion(
                            seccionActual,
                            setSeccionActual,
                            nombresSecciones
                          )
                        }
                        handleSendQuiz={() => {
                          if (!hasError) {
                            handleSendQuiz();
                          }
                        }}
                        hasError={hasError}
                        isSubmitting={isSubmitting}
                        isLastQuestion={
                          seccionActual ===
                          nombresSecciones[nombresSecciones.length - 1]
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CuestionarioPage;
