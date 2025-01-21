import PropTypes from "prop-types";

const InicioCuestionario = ({
  aceptaTerminos,
  setAceptaTerminos,
  handleStartQuiz,
  startQuizError,
  setStartQuizError,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-6 sm:p-8 shadow-xl rounded-xl max-w-md sm:max-w-lg md:max-w-xl w-full transition-opacity duration-500 ease-in-out">
      <h3 className="font-bold text-xl sm:text-2xl text-center mb-4 text-Moonstone">
        Términos y Condiciones
      </h3>
      <p className="text-gray-600 text-xs sm:text-sm text-center mb-4">
        Autorizo el uso de los datos para el proceso de investigación y
        difusión del proyecto Wild E, que tiene por objetivo fortalecer la
        educación en emprendimiento en instituciones de educación superior de
        América y Europa, a través de un modelo teórico y la utilización de
        recursos audiovisuales inspirados en la naturaleza y la fauna local. He
        sido informado(a) de que se puede hacer preguntas sobre la
        investigación en cualquier momento y que es posible el retractar mi
        decisión al respecto, sin tener que dar explicaciones ni sufrir
        consecuencia alguna por tal decisión. De tener preguntas, reclamos o
        comentarios sobre la participación en este proyecto, contactar al
        equipo responsable Pablo Zamora (pablo.zamora@pucv.cl) y Patricia
        Ibáñez (patricia.iban@gmail.com).
      </p>
      {startQuizError && (
        <span className="text-red-600 text-xs sm:text-sm mb-2 block">
          {startQuizError}
        </span>
      )}
      <label className="flex items-center mb-4 transition-colors duration-200 ease-in-out hover:bg-gray-100 rounded-md p-2 w-full">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => {
            setAceptaTerminos(e.target.checked);
            if (startQuizError) setStartQuizError("");
          }}
          className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
        />
        <span className="text-gray-700 text-sm sm:text-base">
          Acepto los términos y condiciones
        </span>
      </label>
      <button
        onClick={handleStartQuiz}
        className="bg-Moonstone rounded-full text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 w-full transition-transform duration-200 ease-in-out transform hover:scale-105"
      >
        Iniciar Cuestionario
      </button>
    </div>
  );
};

InicioCuestionario.propTypes = {
  aceptaTerminos: PropTypes.bool.isRequired,
  setAceptaTerminos: PropTypes.func.isRequired,
  handleStartQuiz: PropTypes.func.isRequired,
  startQuizError: PropTypes.string,
  setStartQuizError: PropTypes.func.isRequired,
};

export default InicioCuestionario;
