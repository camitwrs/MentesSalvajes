import { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types"; // Importación de PropTypes

// Crea el contexto fuera del componente
export const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const [finalData, setFinalData] = useState({});
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Estado para iniciar el cuestionario

  function handleStartQuiz() {
    setIsQuizStarted(true); // Cambiar el estado para iniciar el cuestionario
  }

  function submitData() {
    // Definir las preguntas clave y sus dependencias
    const questionsConfig = {
        20: [21], // Si 20 tiene valor, 21 debe ser null si no se responde
        56: [57, 58, 60, 61, 62, 64, 65] // Si 56 tiene valor, las siguientes deben ser null si no se responden
    };

    // Crear el objeto finalData con lógica condicional para las dependencias
    const completedUserData = Object.keys(questionsConfig).reduce((acc, questionId) => {
        const dependentIds = questionsConfig[questionId];

        // Si la pregunta principal tiene respuesta, copia el valor
        if (userData[questionId]) {
            acc[questionId] = userData[questionId];
            
            // Para cada pregunta dependiente, asigna null si no tiene respuesta
            dependentIds.forEach((dependentId) => {
                acc[dependentId] = userData[dependentId] ?? null;
            });
        } else {
            // Si la pregunta principal no tiene respuesta, asigna null a todo
            acc[questionId] = null;
            dependentIds.forEach((dependentId) => {
                acc[dependentId] = null;
            });
        }
        return acc;
    }, {});

    // Copiar todas las respuestas de userData que no están en la lógica de dependencias
    Object.keys(userData).forEach((key) => {
        if (!(key in completedUserData)) {
            completedUserData[key] = userData[key];
        }
    });

    // Actualizar el estado finalData con los valores procesados
    setFinalData((prevFinalData) => ({
        ...prevFinalData,
        ...completedUserData
    }));

    setUserData({});
    setCurrentQuestionIndex(0);
    setIsQuizStarted(false);
  }




  useEffect(() => {
    console.log("userData actualizado:", userData);
  }, [userData]);

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
