import prototipo from "../../shared/assets/prototipo4.png";
import logo from "../../shared/assets/logo.svg";
import { MoveRight, Clipboard } from "lucide-react";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-YankeesBlue h-20 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Logo y Título */}
        <div className="flex items-center gap-x-3">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 md:h-16 mr-3" />
          <span className="hidden sm:block text-white font-logolike text-base sm:text-lg md:text-3xl font-bold">
            MENTES SALVAJES
          </span>
        </div>

        {/* Botón */}
        <Link
          to="/login"
          className="bg-white text-YankeesBlue py-2 px-3 sm:py-2.5 sm:px-4 md:py-3 md:px-5 rounded-md text-xs sm:text-sm md:text-base hover:bg-gray-200 hover:shadow-md transition-all flex items-center gap-2"
        >
          <MoveRight className="h-5 w-5 stroke-YankeesBlue" />
          Ingresar
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white flex justify-center items-center">
        <div className="container mx-auto px-3 flex flex-col md:flex-row items-center justify-center md:px-8 gap-6">
          {/* Text Section */}
          <div className="md:pl-8 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3">
              Los Educadores de Emprendimiento <br />
              son Mamíferos Marinos.
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-4">
              Descubre con nosotros tu perfil educativo.
            </p>
            <Link
              to="/cuestionario"
              className="bg-YankeesBlue text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 lg:px-6 lg:py-4 rounded-md text-xs sm:text-sm md:text-base lg:text-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Clipboard className="h-6 w-6 stroke-white" />
              Haz el cuestionario aquí
            </Link>
          </div>

          <div className="">
            <img
              src={prototipo}
              alt="Mamifero Marino"
              className="w-40 sm:w-48 md:w-64 lg:w-72 h-auto"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-lightgray py-3 text-center">
        <p className="text-gray-500 text-xs">
          © 2025 Jan Houter & Camila Torres TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
