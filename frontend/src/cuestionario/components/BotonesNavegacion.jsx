import PropTypes from "prop-types";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

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
        className={`flex items-center bg-Moonstone text-white py-2 px-4 rounded-md ${
          currentQuestionIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-600 hover:scale-105"
        }`}
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />{" "}
        {/* Añade mr-2 para un margen a la derecha */}
        Anterior
      </button>

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
        {isLastQuestion ? (
          isSubmitting ? (
            "Enviando..."
          ) : (
            <>
              Enviar
              <PaperAirplaneIcon className="h-5 w-5 ml-2" />
            </>
          )
        ) : (
          "Siguiente"
        )}
        {!isLastQuestion && <ArrowRightIcon className="h-5 w-5 ml-2" />}
      </button>
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
