"use client";

import PropTypes from "prop-types";
import { ClipboardList, Fish, Anchor, CheckCircle2 } from "lucide-react";

const Inicio = ({
  aceptaTerminos,
  setAceptaTerminos,
  handleStartQuiz,
  startQuizError,
  setStartQuizError,
}) => {
  return (
    <div>
      {/* Header con diseño mejorado */}
      <div className="bg-white rounded-2xl border border-cyan-100 overflow-hidden mb-8">
        <div className="bg-Moonstone px-8 py-6">
          <div className="flex items-center justify-center text-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-center">
              Aventura Submarina del Emprendimiento
            </h1>
            <Fish className="h-8 w-8 ml-3 animate-bounce" />
          </div>
        </div>

        {/* Términos y Condiciones con mejor estructura */}
        <div className="px-8 py-6">
          <div className="flex items-center justify-center mb-6">
            <ClipboardList className="h-6 w-6 text-cyan-600 mr-2" />
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-600">
              Términos y Condiciones
            </h2>
          </div>

          {/* Contenido organizado en secciones */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            {/* Bienvenida */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-6 border-l-4 border-cyan-400">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🧜‍♀️</div>
                <div>
                  <h3 className="font-semibold text-lg text-cyan-800 mb-2">
                    ¡Bienvenid@ a tu aventura submarina!
                  </h3>
                  <p className="text-sm sm:text-base">
                    Este cuestionario es el primer chapuzón en la creación de un
                    colorido y fantástico registro de todas aquellas personas
                    que enseñan, inspiran y fomentan el emprendimiento en
                    distintos rincones del mundo.
                  </p>
                </div>
              </div>
            </div>

            {/* Concepto */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-6 border-l-4 border-teal-400">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🐳</div>
                <div>
                  <h3 className="font-semibold text-lg text-teal-800 mb-2">
                    ¿Te imaginas que tu identidad como promotor del
                    emprendimiento pudiera representarse con una ballena sabia,
                    una foca inquieta o una nutria curiosa?
                  </h3>
                  <p className="text-sm sm:text-base">
                    junto a un equipo de investigadores algo locos (y muy
                    creativos), hemos inventado una manera de hacerlo posible.{" "}
                    <br />
                    <br />
                    Inspirados en la evolución de los mamíferos marinos,
                    descubrimos que quienes enseñan emprendimiento vienen de
                    muchas disciplinas y contextos distintos. ¡Como los
                    delfines, morsas o manatíes, que se han adaptado de formas
                    sorprendentes! Así nació nuestra idea: usar animales marinos
                    como metáforas para representar las identidades de los
                    educadores emprendedores. 🐬✨ <br />
                    <br />
                    Tus respuestas nos permitirán reunir datos que, con la ayuda
                    de talentosos ilustradores y diseñadores, se transformarán
                    en criaturas marinas de fantasía únicas —¡basadas en ti!—.
                    No es magia instantánea, pero con un poco de paciencia,
                    podrás conocer a tu <em>alter ego oceánico.</em>
                  </p>
                </div>
              </div>
            </div>

            {/* Proceso */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-400">
              <div className="flex items-start">
                <div className="text-2xl mr-3">🦭</div>
                <div>
                  <h3 className="font-semibold text-lg text-purple-800 mb-2">
                    Nuestra hipótesis es simple (y divertida): los educadores de
                    emprendimiento son mamíferos marinos.
                  </h3>
                  <p className="text-sm sm:text-base">
                    Así que, sumérgete con nosotros en esta experiencia,
                    responde con calma y déjate sorprender. Porque investigar
                    también puede ser una forma de jugar. 🌟
                  </p>
                </div>
              </div>
            </div>

            {/* Consentimiento informado */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-400">
              <div className="flex items-start">
                <div>
                  <h3 className="font-semibold text-lg text-blue-800 mb-3">
                    🧜‍♂️ Consentimiento informado: Antes de zarpar, ¡una pequeña
                    charla de capitán a tripulante! ⚓
                  </h3>
                  <p className="mb-3">
                    Hola, navegante del conocimiento emprendedor 🌊 <br />
                    <br />
                    Antes de sumergirte en esta aventura marina donde
                    descubrirás tu identidad como educador de emprendimiento
                    (¡en forma de criatura fantástica!), queremos contarte qué
                    implica tu participación en este estudio —sin tecnicismos
                    aburridos, prometido 🐙—.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">🔍</span>¿De qué va todo esto?
                      </h4>
                      <p>
                        Estudio exploratorio y creativo que busca representar
                        visualmente tu identidad profesional como educador de
                        emprendimiento usando mamíferos marinos como
                        inspiración.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">📝</span>¿Qué vas a hacer?
                      </h4>
                      <p>
                        Responder un cuestionario de 15-20 minutos. No hay
                        respuestas correctas o incorrectas, solo buscamos
                        conocer más sobre ti y tu forma de enseñar.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">🔒</span>Tus datos
                      </h4>
                      <p>
                        Participación voluntaria y confidencial. Puedes
                        retirarte en cualquier momento. Los resultados se
                        publican de forma anónima o colectiva.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                        <span className="mr-2">🎁</span>Beneficios
                      </h4>
                      <p>
                        Recibirás una ilustración personalizada que representa
                        tu identidad como educador/a de emprendimiento. ¡Ideal
                        para mostrar con orgullo! 🎨
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Al participar, aceptas que:</strong> Entiendes los
                      objetivos del estudio, sabes que tu participación es
                      voluntaria, y estás de acuerdo con el uso confidencial de
                      tus respuestas para fines de investigación, divulgación y
                      arte.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de aceptación y botón */}
      <div className="bg-white rounded-2xl border border-cyan-100 p-8">
        {startQuizError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <span className="text-red-700 text-sm sm:text-base font-medium">
                {startQuizError}
              </span>
            </div>
          </div>
        )}

        {/* Checkbox mejorado */}
        <div className="mb-8">
          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className="relative flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => {
                  setAceptaTerminos(e.target.checked);
                  if (startQuizError) setStartQuizError("");
                }}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                  aceptaTerminos
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "border-gray-300 group-hover:border-cyan-400"
                }`}
              >
                {aceptaTerminos && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
            <span className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed">
              Acepto los términos y condiciones y estoy listo/a para descubrir
              mi identidad marina como educador/a de emprendimiento 🌊
            </span>
          </label>
        </div>

        {/* Botón mejorado */}
        <div className="text-center space-y-4">
          <button
            onClick={handleStartQuiz}
            disabled={!aceptaTerminos}
            className={`relative overflow-hidden px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
              aceptaTerminos
                ? "bg-cyan-600 text-white hover:from-cyan-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Anchor className="w-5 h-5" />
              <span>Iniciar Aventura Submarina</span>
              <Anchor className="w-5 h-5" />
            </div>
          </button>

          {/* Información de duración mejorada */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-center text-amber-800">
              <div className="text-lg mr-2">⏱️</div>
              <p className="text-sm sm:text-base">
                <span className="font-medium">Duración estimada:</span>
                <span className="font-bold text-amber-900 ml-1">
                  20 minutos
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center space-x-2 text-cyan-600">
          <Fish className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">
            Sumérgete en tu identidad emprendedora
          </span>
          <Fish className="w-4 h-4 animate-pulse" />
        </div>
      </div>
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
