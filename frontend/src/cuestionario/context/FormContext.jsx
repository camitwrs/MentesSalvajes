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
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Estado para iniciar el cuestionario
  const [quizId, setQuizId] = useState(null); // Nuevo estado para el ID del cuestionario
  const { user } = useAuth();

  function handleStartQuiz() {
    setIsQuizStarted(true); // Cambiar el estado para iniciar el cuestionario
  }

  function submitData() {
    const questionsConfig = {
      20: [21],
      56: [57, 58, 60, 61, 62, 64, 65],
    };

    const completedUserData = Object.keys(questionsConfig).reduce(
      (acc, questionId) => {
        const dependentIds = questionsConfig[questionId];

        if (userData[questionId]) {
          acc[questionId] = userData[questionId];

          dependentIds.forEach((dependentId) => {
            acc[dependentId] = userData[dependentId] ?? null;
          });
        } else {
          acc[questionId] = null;
          dependentIds.forEach((dependentId) => {
            acc[dependentId] = null;
          });
        }
        return acc;
      },
      {}
    );

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

      // Enviar los datos al backend después de actualizar el estado
      const finalDataToSend = {
        idusuario: user.idusuario,
        idcuestionario: quizId,
        respuestas: updatedFinalData,
      };

      guardarRespuestaRequest(finalDataToSend)
        .then((response) => {
          console.log("Respuestas enviadas correctamente:", response.data);
        })
        .catch((error) => {
          console.error("Error al enviar respuestas:", error);
        });

      return updatedFinalData; // Asegurar que el estado se actualiza con los datos correctos
    });

    setUserData({});
    setCurrentQuestionIndex(0);
    setIsQuizStarted(false);
  }

  useEffect(() => {
    console.log("userData actualizado:", userData);
    console.log("quizId actualizado:", quizId);
  }, [userData, quizId]);

  useEffect(() => {
    console.log("finalData actualizado:", finalData);
  }, [finalData]);

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
        setQuizId,
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
