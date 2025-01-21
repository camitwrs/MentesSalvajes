import React from "react";

const BotonesNavegacion = ({
  currentQuestionIndex,
  totalQuestions,
  handleNext,
  handlePrev,
  handleSendQuiz,
  hasError,
  isSubmitting,
  isLastQuestion,
}) => {
  return (
    <div className="flex justify-between mt-4 w-full">
      {/* Botón Anterior */}
      <button
        onClick={handlePrev}
        disabled={currentQuestionIndex === 0}
        className={`bg-gray-700 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full transition-opacity duration-200 ease-in-out ${
          currentQuestionIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-600 hover:scale-105"
        }`}
      >
        Anterior
      </button>

      {/* Botón Siguiente o Enviar */}
      <button
        onClick={isLastQuestion ? handleSendQuiz : handleNext}
        disabled={hasError || isSubmitting}
        className={`py-2 px-4 sm:py-3 sm:px-6 rounded-full ${
          hasError || isSubmitting
            ? "bg-green-400 cursor-not-allowed"
            : isLastQuestion
            ? "bg-green-600 hover:bg-green-500 text-white transition-transform duration-200 ease-in-out transform hover:scale-105"
            : "bg-Moonstone text-white transition-transform duration-200 ease-in-out transform hover:scale-105"
        }`}
      >
        {isLastQuestion ? (isSubmitting ? "Enviando..." : "Enviar") : "Siguiente"}
      </button>
    </div>
  );
};

export default BotonesNavegacion;
