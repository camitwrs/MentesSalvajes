import PropTypes from "prop-types";

import { MoveLeft, MoveRight, SendHorizontal } from "lucide-react";

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
        className={`flex items-center py-2 px-4 rounded-md ${
          currentQuestionIndex === 0
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-Moonstone text-white hover:scale-105"
        }`}
      >
        <MoveLeft className="h-5 w-5 mr-2" />{" "}
        {/* Añade mr-2 para un margen a la derecha */}
        Anterior
      </button>

      <div className="flex flex-col items-center">
        <button
          onClick={isLastQuestion ? handleSendQuiz : handleNext}
          disabled={hasError || isSubmitting}
          className={`flex items-center py-2 px-4 rounded-md ${
            hasError || isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : isLastQuestion
              ? "bg-green-600 hover:bg-green-500 text-white font-bold"
              : "bg-Moonstone text-white hover:scale-105"
          }`}
        >
          {isLastQuestion && isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              <span className="ml-3 text-sm sm:text-base text-white font-medium">
                Enviando información
              </span>
            </div>
          ) : isLastQuestion ? (
            <>
              Enviar
              <SendHorizontal className="h-5 w-5 ml-2" />
            </>
          ) : (
            <>
              Siguiente
              <MoveRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>

        
      </div>
    </div>
  );
};

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
