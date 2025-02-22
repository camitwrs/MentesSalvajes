import { useState, createContext, useEffect } from "react";
import PropTypes from "prop-types"; // Importación de PropTypes

// Crea el contexto fuera del componente
export const FormContext = createContext();

const FormProvider = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState({});
  const [finalData, setFinalData] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false); // Estado para iniciar el cuestionario
  const [currentQuizId, setCurrentQuizId] = useState(null);

  function handleStartQuiz(quizId) {
    setIsQuizStarted(true); // Cambiar el estado para iniciar el cuestionario
    setCurrentQuizId(quizId);
  }

  function submitData() {
    setFinalData((prevFinalData) => [
      ...prevFinalData,
      { quizId: currentQuizId, ...userData },
    ]);
    setUserData({});
    setCurrentQuestionIndex(0);
    setIsQuizStarted(false); // Reiniciar el estado al enviar los datos
    setCurrentQuizId(null); // Opcional: reinicias el id tras enviar los datos
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
        currentQuizId, // Expones el id del cuestionario
        setCurrentQuizId,
        handleStartQuiz, // Función para iniciar el cuestionario con el id seleccionado
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
