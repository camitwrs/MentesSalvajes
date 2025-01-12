import React from "react";
import nutria_nobg from "../assets/nutria_nobg.png";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-YankeesBlue h-24 flex items-center justify-center">
        <div className="text-white text-5xl font-bold">MENTES SALVAJES</div>
      </nav>

      <main className="flex-grow bg-white flex justify-center items-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between lg:px-12">
          <div className="lg:pl-12 text-center lg:text-left mt-8 sm:mt-12 lg:mt-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
              Los Educadores de Emprendimiento <br />
              son Mamíferos Marinos.
            </h1>
            <p className="text-lg sm:text-2xl lg:text-3xl text-p-Gray mb-6">
              Descubre con nosotros tu perfil educativo.
            </p>
            <Link
              to="/cuestionario"
              className="bg-YankeesBlue text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl inline-block hover:scale-105"
            >
              &gt;&gt; Haz el cuestionario aquí
            </Link>
          </div>

          <div className="mt-8 lg:mt-0">
            <img
              src={nutria_nobg}
              alt="Mamífero Marino"
              className="w-64 sm:w-80 lg:w-96 xl:w-[28rem] h-auto"
            />
          </div>
        </div>
      </main>

      <footer className="bg-custom-lightgray py-1 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 SAUKKOTECH TODOS LOS DERECHOS RESERVADOS.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
