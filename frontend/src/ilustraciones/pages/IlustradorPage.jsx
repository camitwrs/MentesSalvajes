import { useState } from "react";
import CartaIlustracion from "../components/CartaIlustracion";
import FiltrosIlustraciones from "../components/FiltrosIlustraciones";

function IlustradorPage() {
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [orden, setOrden] = useState("reciente");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-bold text-lg sm:text-2xl text-center sm:text-left mb-6">
        Ilustraciones Pendientes
      </h1>

      <FiltrosIlustraciones
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        orden={orden}
        setOrden={setOrden}
      />

      <CartaIlustracion
        estadoFiltro={estadoFiltro}
        orden={orden}
      />
    </div>
  );
}

export default IlustradorPage;
