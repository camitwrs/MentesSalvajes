import Navbar from "../../shared/components/Navbar";
import CartaIlustracion from "../components/CartaIlustracion";

function IlustradorPage() {
  return(
    <div>
      <Navbar />
      <div>
        <h1 className="font-bold text-2xl p-4">Ilustraciones Pendientes</h1>
        <CartaIlustracion />
      </div>
    </div>
  );
}

export default IlustradorPage;
