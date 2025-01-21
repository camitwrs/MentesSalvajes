import { useContext, useState, useEffect, useCallback } from "react";
import { FormContext } from "../context/FormContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InicioCuestionario from "../components/InicioCuestionario";
import EstadoCargaYError from "../components/EstadoCargaYError";
import ContenidoCuestionario from "../components/ContenidoCuestionario";
import BotonesNavegacion from "../components/BotonesNavegacion";
import { useCuestionario } from "../hooks/useCuestionario";
import { useInicializarAlternativas } from "../hooks/useInicializarAlternativas";
import { useManejoEnvio } from "../hooks/useManejoEnvio";
import {
  handleInputChange,
  handleCheckboxChange,
  validateCurrentInput,
} from "../utils/utils";
import {
  handleNextQuestion,
  handlePrevQuestion,
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
  const MIN_NUMBER = 18;
  const MAX_NUMBER = 80;

  // Cargar preguntas y alternativas desde el backend
  const { preguntas, alternativas, isLoading, loadError, setPreguntas, setAlternativas } = useCuestionario(1);

  // Este efecto se activa cada vez que cambia la pregunta actual
  useInicializarAlternativas(preguntas, currentQuestionIndex, alternativas, userData, setUserData);

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

  // Manejar cambios en inputs de tipo radio y select
  const handleInputChangeWrapper = (e) => {
    handleInputChange(
      e,
      preguntas,
      currentQuestionIndex,
      setUserData,
      userData
    );

    // Limpiar mensajes de error si existen
    if (startQuizError) setStartQuizError("");
    if (submitError) setStartQuizError("");
  };

  // Manejar cambios en inputs de tipo checkbox
  const handleCheckboxChangeWrapper = (e) => {
    handleCheckboxChange(
      e,
      preguntas,
      currentQuestionIndex,
      setUserData,
      userData,
      setCheckboxError,
      submitError,
      setStartQuizError
    );
  };

  // Manejar cambios en inputs de tipo range
  const handleRangeChange = (e, idPregunta) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const opciones = alternativas[idPregunta] || [];
    const selectedAlternativa = opciones[selectedIndex];

    setUserData({
      ...userData,
      [idPregunta]: selectedAlternativa
        ? selectedAlternativa.idalternativa
        : null,
    });

    // Limpiar mensajes de error
    if (submitError) setStartQuizError("");
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

  return (
    <div className="flex flex-col w-screen h-screen bg-pulpo-pattern bg-gray-200 bg-cover bg-center bg-no-repeat p-0">
      <div className="flex justify-start mb-4">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        {/* Mostrar carga o errores */}
        <EstadoCargaYError isLoading={isLoading} loadError={loadError} />

        {/* Mostrar el contenido principal del cuestionario si no hay carga ni error */}
        {!isLoading && !loadError && (
          <>
            {!isQuizStarted ? (
              <InicioCuestionario
                aceptaTerminos={aceptaTerminos}
                setAceptaTerminos={setAceptaTerminos}
                handleStartQuiz={handleStartQuiz}
                startQuizError={startQuizError}
              />
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
                    <ContenidoCuestionario
                      preguntas={preguntas}
                      alternativas={alternativas}
                      currentQuestionIndex={currentQuestionIndex}
                      userData={userData}
                      setUserData={setUserData}
                      checkboxError={checkboxError}
                      setCheckboxError={setCheckboxError}
                      numberError={numberError}
                      setNumberError={setNumberError}
                      submitError={submitError}
                    />

                    <div className="flex justify-between mt-4 w-full">
                      <BotonesNavegacion
                        currentQuestionIndex={currentQuestionIndex}
                        totalQuestions={preguntas.length}
                        handleNext={() =>
                          handleNextQuestion(
                            currentQuestionIndex,
                            setCurrentQuestionIndex,
                            preguntas.length
                          )
                        }
                        handlePrev={() =>
                          handlePrevQuestion(
                            currentQuestionIndex,
                            setCurrentQuestionIndex
                          )
                        }
                        handleSendQuiz={handleSendQuiz} // Asegúrate de pasar esta función
                        hasError={hasError}
                        isSubmitting={isSubmitting}
                        isLastQuestion={
                          currentQuestionIndex === preguntas.length - 1
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