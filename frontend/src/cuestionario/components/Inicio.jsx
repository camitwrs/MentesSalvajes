import PropTypes from "prop-types";
import { ClipboardList } from "lucide-react";

const Inicio = ({
  aceptaTerminos,
  setAceptaTerminos,
  handleStartQuiz,
  startQuizError,
  setStartQuizError,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 sm:px-10 bg-white  rounded-lg">
      <h3 className="font-bold text-xl sm:text-2xl text-right mb-6 text-Moonstone flex items-center justify-end">
        <ClipboardList className="h-6 w-6 inline-block mr-2" />
        Términos y Condiciones
      </h3>

      <p className="text-gray-600 text-sm sm:text-base text-justify mb-6 leading-relaxed">
        Autorizo el uso de los datos para el proceso de investigación y difusión
        del proyecto Wild E, que tiene por objetivo fortalecer la educación en
        emprendimiento en instituciones de educación superior de América y
        Europa, a través de un modelo teórico y la utilización de recursos
        audiovisuales inspirados en la naturaleza y la fauna local. He sido
        informado(a) de que se puede hacer preguntas sobre la investigación en
        cualquier momento y que es posible retractar mi decisión al respecto,
        sin tener que dar explicaciones ni sufrir consecuencia alguna por tal
        decisión. De tener preguntas, reclamos o comentarios sobre la
        participación en este proyecto, contactar al equipo responsable Pablo
        Zamora (pablo.zamora@pucv.cl) y Patricia Ibáñez
        (patricia.ibanez@gmail.com).
      </p>

      {startQuizError && (
        <span className="text-red-600 text-sm sm:text-base mb-4 block text-center">
          {startQuizError}
        </span>
      )}

      <label className="flex items-center space-x-3 mb-6">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => {
            setAceptaTerminos(e.target.checked);
            if (startQuizError) setStartQuizError("");
          }}
          className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 rounded"
        />
        <span className="text-gray-700 text-sm sm:text-base font-bold">
          Acepto los términos y condiciones
        </span>
      </label>

      <button
        onClick={handleStartQuiz}
        className="w-full sm:max-w-xs mx-auto block font-bold bg-Moonstone text-white py-3 px-6 rounded-md hover:bg-cyan-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        Iniciar Cuestionario
      </button>

      <p className="mt-4 text-xs sm:text-sm text-center text-gray-700 p-2 rounded">
        La duración del cuestionario es de <strong>20 minutos</strong> aproximadamente.
      </p>
    </div>
  );
};

Inicio.propTypes = {
  aceptaTerminos: PropTypes.bool.isRequired,
  setAceptaTerminos: PropTypes.func.isRequired,
  handleStartQuiz: PropTypes.func.isRequired,
  startQuizError: PropTypes.string,
  setStartQuizError: PropTypes.func.isRequired,
};

export default Inicio;
