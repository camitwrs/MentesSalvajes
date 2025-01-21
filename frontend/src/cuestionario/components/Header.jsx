import React from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../../shared/assets/logo.svg";

const Header = () => {
  return (
    <header className="absolute top-4 left-4">
      <Link
        to="/"
        className="flex items-center bg-YankeesBlue text-white font-bold py-2 px-4 rounded hover:bg-YankeesBlueDark transition duration-300"
      >
        <img src={logo} alt="Logo del Proyecto" className="h-8 w-auto mr-2" />
        <ArrowBackIcon className="h-6 w-6" />
      </Link>
    </header>
  );
};

export default Header;
