export const handleNextQuestion = (
    currentQuestionIndex,
    setCurrentQuestionIndex,
    totalQuestions
  ) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  export const handlePrevQuestion = (currentQuestionIndex, setCurrentQuestionIndex) => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  