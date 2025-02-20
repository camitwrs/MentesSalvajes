import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import logo from "../../shared/assets/logo.svg";

const Header = () => {
  return (
    <header className="absolute top-4 left-4">
      <Link
        to="/"
        className="hidden md:flex items-center bg-Moonstone text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700"
      >
        <img src={logo} alt="Logo del Proyecto" className="h-8 w-auto mr-2" />
        <ArrowLeftIcon className="h-6 w-6" />
      </Link>
    </header>
  );
};

export default Header;
