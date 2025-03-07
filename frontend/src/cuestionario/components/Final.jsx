import imagen from "../assets/orca.svg";

const Final = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-8">
      {/* Mensaje de agradecimiento */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-Moonstone mb-4">
          ¡Gracias por completar el cuestionario!
        </h2>
        <p className="text-gray-800 text-sm sm:text-base">
          Hemos recibido tus respuestas.
        </p>
      </div>

      {/* Contenido de texto e imagen */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
        {/* Texto a la izquierda */}
        <div className="w-full md:w-1/2">
          <p className="text-gray-600 font-bold mb-2 text-base sm:text-lg">
            ¡Hemos descubierto su perfil!
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
            El profesor ___ A.1.1.____.
            Su especie animal es ______C.1; C2 o C3_______ + ____Apellido del B.4.1____ + de____A.1.4.____.
            Su capacidad de sumergirse en las profundidades alcanza hasta los ____4.1____.
            Su velocidad de nado es de ___4.2____.
            La distancia que puede recorrer al salir del agua es de __4.3____.
          </p>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Su morfología es de un ___ A,2___.
            Tiene rayas o lunares de color ___A.3___.
            Su tamaño es de __ B.1.2___.
            Sus ojos son ____ B.3____.
            Su hábitat está compuesto por: A4.1; A4.2; A4.3; A4.4; A4.5; A4.6; A4.7; A4.8; y A4.9.
          </p>
        </div>

        {/* Imagen a la derecha */}
        <div className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 bg-white shadow-md">
          <div className="relative h-[250px] md:h-[400px] w-full rounded-lg overflow-hidden flex justify-center">
            <img
              src={imagen}
              alt="Perfil descubierto"
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Final;
