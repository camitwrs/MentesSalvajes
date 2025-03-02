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
    <div>
      <h3 className="font-bold text-xl text-right mb-6 text-Moonstone">
        <ClipboardList className="h-5 w-5 inline-block mr-2" />
        Términos y Condiciones
      </h3>
      <p className="text-gray-600 text-sm text-center mb-6">
        Autorizo el uso de los datos para el proceso de investigación y difusión
        del proyecto Wild E, que tiene por objetivo fortalecer la educación en
        emprendimiento en instituciones de educación superior de América y
        Europa, a través de un modelo teórico y la utilización de recursos
        audiovisuales inspirados en la naturaleza y la fauna local. He sido
        informado(a) de que se puede hacer preguntas sobre la investigación en
        cualquier momento y que es posible el retractar mi decisión al respecto,
        sin tener que dar explicaciones ni sufrir consecuencia alguna por tal
        decisión. De tener preguntas, reclamos o comentarios sobre la
        participación en este proyecto, contactar al equipo responsable Pablo
        Zamora (pablo.zamora@pucv.cl) y Patricia Ibáñez
        (patricia.ibanez@gmail.com).
      </p>
      {startQuizError && (
        <span className="text-red-600 text-sm mb-4 block">
          {startQuizError}
        </span>
      )}
      <label className="flex items-center mb-6">
        <input
          type="checkbox"
          checked={aceptaTerminos}
          onChange={(e) => {
            setAceptaTerminos(e.target.checked);
            if (startQuizError) setStartQuizError("");
          }}
          className="mr-3 h-5 w-5 text-blue-600 rounded"
        />
        <span className="text-gray-700 text-sm font-bold">
          Acepto los términos y condiciones
        </span>
      </label>
      <button
        onClick={handleStartQuiz}
        //className="bg-Moonstone rounded-full text-white font-semibold py-3 px-6 w-full transition-transform duration-200 ease-in-out transform hover:scale-105"
        className="w-full font-bold bg-Moonstone text-white py-2 px-4 rounded-md hover:bg-cyan-700 focus:outline-none focus:border-orange-500"
      >
        Iniciar Cuestionario
      </button>
      <p className="mt-4 px-4 text-xs text-center sm:text-sm text-gray-700 p-2 rounded">
        La duración del cuestionario es de 20 minutos aproximadamente.
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
