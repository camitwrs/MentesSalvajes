import { useState, useEffect } from "react"
import CartaIlustracion from "../components/CartaIlustracion"
import FiltrosIlustraciones from "../components/FiltrosIlustraciones"
import { getAllIlustracionesRequest } from "../../api/ilustraciones"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown"
import { Button } from "@heroui/button"
import { SortAsc, SortDesc, ChevronDown } from "lucide-react"

function IlustradorPage() {
  const [estadoFiltro, setEstadoFiltro] = useState("todas")
  const [orden, setOrden] = useState("reciente")
  const [ilustraciones, setIlustraciones] = useState([])

  const fetchIlustraciones = () => {
    getAllIlustracionesRequest()
      .then((response) => {
        setIlustraciones(response.data)
      })
      .catch((error) => {
        console.error("Error al obtener las ilustraciones:", error)
      })
  }

  useEffect(() => {
    fetchIlustraciones()
  }, [])

  // Contadores para los filtros
  const total = ilustraciones.length
  const pendientes = ilustraciones.filter((item) => item.estadoilustracion.toLowerCase() === "pendiente").length

  const completadas = ilustraciones.filter((item) => item.estadoilustracion.toLowerCase() === "completado").length

  return (
    <div className="min-h-screen bg-gray-50 w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header con título y búsqueda */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Ilustraciones Pendientes</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Dropdown de ordenación */}
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="border border-gray-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-2 w-full sm:min-w-[200px] justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {orden === "reciente" ? (
                      <SortAsc className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <SortDesc className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span>{orden === "reciente" ? "Fecha: Más reciente" : "Fecha: Más antiguo"}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Ordenar por fecha" onAction={(key) => setOrden(key)}>
                <DropdownItem key="reciente">Fecha: Más reciente</DropdownItem>
                <DropdownItem key="antiguo">Fecha: Más antiguo</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-4 sm:mb-6 overflow-x-auto">
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

        {/* Tarjetas de ilustraciones */}
        <CartaIlustracion
          estadoFiltro={estadoFiltro}
          orden={orden}
          ilustraciones={ilustraciones}
          fetchIlustraciones={fetchIlustraciones}
        />
      </div>
    </div>
  )
}

export default IlustradorPage