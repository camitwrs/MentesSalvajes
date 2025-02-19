import PropTypes from "prop-types";

const BotonesNavegacion = ({
  currentQuestionIndex,
  handleNext,
  handlePrev,
  handleSendQuiz,
  hasError,
  isSubmitting,
  isLastQuestion,
}) => {
  return (
    <div className="flex justify-between w-full">
      <button
        onClick={handlePrev}
        disabled={currentQuestionIndex === 0}
        className={`bg-gray-700 text-white py-2 px-4 rounded-full ${
          currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 hover:scale-105"
        }`}
      >
        Anterior
      </button>

      <button
        onClick={isLastQuestion ? handleSendQuiz : handleNext}
        disabled={hasError || isSubmitting}
        className={`py-2 px-4 rounded-full ${
          hasError || isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : isLastQuestion
            ? "bg-green-600 hover:bg-green-500 text-white"
            : "bg-Moonstone text-white hover:scale-105"
        }`}
      >
        {isLastQuestion ? (isSubmitting ? "Enviando..." : "Enviar") : "Siguiente"}
      </button>
    </div>
  );
};

// ✅ Validación de props con PropTypes
BotonesNavegacion.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleSendQuiz: PropTypes.func.isRequired,
  hasError: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isLastQuestion: PropTypes.bool.isRequired,
};

export default BotonesNavegacion;
