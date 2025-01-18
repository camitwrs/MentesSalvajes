import prototipo from "../../shared/assets/prototipo4.png";
import logo from "../../shared/assets/logo.svg";
import LoginIcon from "@mui/icons-material/Login";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-YankeesBlue h-24 px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo y Título */}
        <div className="flex items-center gap-x-4">
          <img src={logo} alt="Logo" className="h-12 sm:h-16 lg:h-20 mr-4" />
          <span className="hidden sm:block text-white text-lg sm:text-xl lg:text-3xl font-bold">
            MENTES SALVAJES
          </span>
        </div>

        {/* Botón */}
        <Link
          to="/login"
          className="bg-white text-YankeesBlue py-2 px-4 sm:py-3 sm:px-6 rounded-md text-sm sm:text-base lg:text-lg hover:bg-gray-200 hover:shadow-md transition-all flex items-center gap-2"
        >
          <LoginIcon className="text-YankeesBlue" />
          Ingresar
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white flex justify-center items-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between lg:px-12">
          {/* Text Section */}
          <div className="lg:pl-12 text-center lg:text-left mt-8 sm:mt-12 lg:mt-16">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-4">
              Los Educadores de Emprendimiento <br />
              son Mamíferos Marinos.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-6">
              Descubre con nosotros tu perfil educativo.
            </p>
            <Link
              to="/cuestionario"
              className="bg-YankeesBlue text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 xl:px-10 xl:py-5 rounded-md text-sm sm:text-base lg:text-lg xl:text-xl inline-block hover:scale-105 transition-transform"
            >
              &gt;&gt; Haz el cuestionario aquí
            </Link>
          </div>

          <div className="mt-8 lg:mt-0">
            <img
              src={prototipo}
              alt="Mamifero Marino"
              className="w-48 sm:w-64 lg:w-80 xl:w-[28rem] h-auto"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-lightgray py-4 text-center">
        <p className="text-gray-500 text-xs sm:text-xs lg:text-xs">
          © 2025 Jan Houter & Camila Torres TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
