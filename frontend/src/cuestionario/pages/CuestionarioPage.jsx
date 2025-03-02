import { useContext, useState, useEffect, useCallback } from "react";
import { FormContext } from "../context/FormContext";
import Header from "../components/Header";
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
  const nombresSecciones = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  // Estados de error
  const [startQuizError, setStartQuizError] = useState("");
  const [checkboxError, setCheckboxError] = useState("");
  const [numberError, setNumberError] = useState("");

  const { isSubmitting, submitSuccess, submitError, handleSendQuiz } =
    useManejoEnvio(submitData);

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
      setIsQuizStarted(true);
      setCurrentQuestionIndex(0);
      setStartQuizError("");
    } else {
      setStartQuizError("Debes aceptar los términos y condiciones para continuar.");
    }
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
      const perteneceASeccion = secciones[seccionActual]?.includes(pregunta.idpregunta);

      // Aplicar condiciones de preguntas dependientes
      if (pregunta.idpregunta === 21) return userData[20] === 66 && perteneceASeccion;
      if (pregunta.idpregunta >= 57) return userData[56] === 153 && perteneceASeccion;

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
          value !== undefined &&
          !isNaN(value) &&
          value >= 1 &&
          value <= 65
        );
      }
      return userData[pregunta.idpregunta] !== undefined;
    });

    return todasRespondidas;
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <div className="flex-grow flex items-center justify-center p-6 sm:p-8">
        <div className="bg-white rounded-lg w-full max-w-4xl p-6 sm:p-8">
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
                <>
                  {submitSuccess ? (
                    <Final
                    />
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

                      <div className="flex justify-between mt-6">
                        <BotonesNavegacion
                          currentQuestionIndex={nombresSecciones.indexOf(seccionActual)}
                          totalQuestions={nombresSecciones.length}
                          handleNext={() => {
                            if (isSeccionCompleta()) {
                              handleNextSeccion(seccionActual, setSeccionActual, nombresSecciones);
                            }
                          }}
                          handlePrev={() =>
                            handlePrevSeccion(seccionActual, setSeccionActual, nombresSecciones)
                          }
                          handleSendQuiz={handleSendQuiz}
                          hasError={!isSeccionCompleta()}
                          isSubmitting={isSubmitting}
                          isLastQuestion={seccionActual === nombresSecciones[nombresSecciones.length - 1]}
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