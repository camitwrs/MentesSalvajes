import { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types";
import { guardarRespuestaRequest } from "../../api/respuestas";
import { useAuth } from "./../../autenticacion/context/AuthContext";

// Crea el contexto fuera del componente
export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const [finalData, setFinalData] = useState({});
  const [idrespuesta, setIdRespuesta] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Estado para iniciar el cuestionario
  const [quizId, setQuizId] = useState(() => {
    return localStorage.getItem("quizId") || null;
  });
  const { user } = useAuth();

  const updateQuizId = (id) => {
    setQuizId(id);
    if (id) {
      localStorage.setItem("quizId", id);
    } else {
      localStorage.removeItem("quizId");
    }
  };

  function handleStartQuiz() {
    setIsQuizStarted(true); // Cambiar el estado para iniciar el cuestionario
  }

  const submitData = async (sessionCode) => {
    const questionsConfig = {
      1: [2, 3, 4, 5, 6, 7, 9, 10, 11],
      7: [9, 10, 11],
      25: [26],
    };

    const completedUserData = Object.keys(questionsConfig).reduce(
      (acc, questionId) => {
        const dependentIds = questionsConfig[questionId];

        if (userData[questionId]) {
          acc[questionId] = userData[questionId];

          dependentIds.forEach((dependentId) => {
            acc[dependentId] = userData[dependentId] ?? "No aplica";
          });
        } else {
          acc[questionId] = "No aplica";
          dependentIds.forEach((dependentId) => {
            acc[dependentId] = "No aplica";
          });
        }
        return acc;
      },
      {}
    );

    // Agrega cualquier otra respuesta que no estÃ© en questionsConfig
    Object.keys(userData).forEach((key) => {
      if (!(key in completedUserData)) {
        completedUserData[key] = userData[key];
      }
    });

    // Primero actualizamos finalData y luego enviamos al backend
    setFinalData((prevFinalData) => {
      const updatedFinalData = {
        ...prevFinalData,
        ...completedUserData,
      };

      return updatedFinalData;
    });

    const finalDataToSend = {
      idusuario: user.idusuario,
      idcuestionario: quizId,
      codigosesion: sessionCode,
      respuestas: {
        ...finalData,
        ...completedUserData,
      },
    };

    try {
      const response = await guardarRespuestaRequest(finalDataToSend);
      setIdRespuesta(response.data.idrespuesta);
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }

    setUserData({});
    setCurrentQuestionIndex(0);
    setIsQuizStarted(false);
  };

  useEffect(() => {
    if (quizId) {
      localStorage.setItem("quizId", quizId);
    } else {
      localStorage.removeItem("quizId");
    }
  }, [quizId]);

  return (
    <FormContext.Provider
      value={{
        currentQuestionIndex,
        setCurrentQuestionIndex,
        userData,
        setUserData,
        finalData,
        setFinalData,
        isQuizStarted,
        setIsQuizStarted,
        handleStartQuiz,
        submitData,
        quizId,
        setQuizId: updateQuizId,
        idrespuesta,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

FormProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validación para la prop children
};

export default FormProvider;
