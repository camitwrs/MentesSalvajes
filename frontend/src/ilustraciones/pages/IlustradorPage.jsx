import { useState, useEffect } from "react";
import CartaIlustracion from "../components/CartaIlustracion";
import FiltrosIlustraciones from "../components/FiltrosIlustraciones";
import { getAllIlustracionesRequest } from "../../api/ilustraciones";

function IlustradorPage() {
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [orden, setOrden] = useState("reciente");
  const [ilustraciones, setIlustraciones] = useState([]);

  const fetchIlustraciones = () => {
    getAllIlustracionesRequest()
      .then((response) => {
        setIlustraciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ilustraciones:", error);
      });
  };

  useEffect(() => {
    fetchIlustraciones();
  }, []);

  // Contadores para los filtros
  const total = ilustraciones.length;
  const pendientes = ilustraciones.filter(
    (item) => item.estadoilustracion === "Pendiente"
  ).length;
  const completadas = ilustraciones.filter(
    (item) => item.estadoilustracion === "Completado"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">Ilustraciones Pendientes</h1>

            <FiltrosIlustraciones
              estadoFiltro={estadoFiltro}
              setEstadoFiltro={setEstadoFiltro}
              orden={orden}
              setOrden={setOrden}
              total={total}
              pendientes={pendientes}
              completadas={completadas}
            />
          </div>

          <CartaIlustracion
            estadoFiltro={estadoFiltro}
            orden={orden}
            ilustraciones={ilustraciones}
            fetchIlustraciones={fetchIlustraciones}
          />
        </div>
      </div>
    </div>
  );
}

export default IlustradorPage;
