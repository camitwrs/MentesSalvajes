export const useNavegacionCuestionario = (currentQuestionIndex, setCurrentQuestionIndex, totalQuestions) => {
    const handleNext = () => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    };
  
    const handlePrev = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    };
  
    return { handleNext, handlePrev };
  };
  