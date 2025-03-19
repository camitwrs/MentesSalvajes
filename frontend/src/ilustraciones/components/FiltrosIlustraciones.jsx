import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Clock, CheckCircle, Filter, SortAsc, SortDesc, Check } from "lucide-react";
import PropTypes from "prop-types";

const FiltrosIlustraciones = ({
  estadoFiltro,
  setEstadoFiltro,
  orden,
  setOrden,
  total,
  pendientes,
  completadas,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

      {/* Filtros de estado */}
      <div className="flex items-center gap-2 flex-wrap bg-gray-50 p-2 rounded-lg">
        <Button
          variant={estadoFiltro === "todas" ? "solid" : "light"}
          color={estadoFiltro === "todas" ? "default" : "ghost"}
          className={`rounded-md ${estadoFiltro === "todas" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setEstadoFiltro("todas")}
          startContent={<Filter className="w-4 h-4" />}
        >
          Todas 
          <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 text-xs font-medium">
            {total}
          </span>
        </Button>

        <Button
          variant={estadoFiltro === "pendientes" ? "solid" : "light"}
          color={estadoFiltro === "pendientes" ? "default" : "ghost"}
          className={`rounded-md ${estadoFiltro === "pendientes" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setEstadoFiltro("pendientes")}
          startContent={<Clock className="w-4 h-4" />}
        >
          Pendientes
          <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 text-xs font-medium">
            {pendientes}
          </span>
        </Button>

        <Button
          variant={estadoFiltro === "completadas" ? "solid" : "light"}
          color={estadoFiltro === "completadas" ? "default" : "ghost"}
          className={`rounded-md ${estadoFiltro === "completadas" ? "bg-white shadow-sm" : ""}`}
          onClick={() => setEstadoFiltro("completadas")}
          startContent={<CheckCircle className="w-4 h-4" />}
        >
          Completadas
          <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 text-xs font-medium">
            {completadas}
          </span>
        </Button>
      </div>

      {/* Dropdown Orden */}
      <div className="flex items-center gap-2 flex-wrap">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              startContent={
                orden === "reciente" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )
              }
              className="border border-gray-300 rounded-md"
            >
              {orden === "reciente" ? "Fecha: Más reciente" : "Fecha: Más antiguo"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Ordenar por fecha"
            onAction={(key) => setOrden(key)}
          >
            <DropdownItem
              key="reciente"
              startContent={
                orden === "reciente" && <Check className="w-4 h-4 text-green-500" />
              }
            >
              Fecha: Más reciente
            </DropdownItem>
            <DropdownItem
              key="antiguo"
              startContent={
                orden === "antiguo" && <Check className="w-4 h-4 text-green-500" />
              }
            >
              Fecha: Más antiguo
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

FiltrosIlustraciones.propTypes = {
  estadoFiltro: PropTypes.string.isRequired,
  setEstadoFiltro: PropTypes.func.isRequired,
  orden: PropTypes.string.isRequired,
  setOrden: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  pendientes: PropTypes.number.isRequired,
  completadas: PropTypes.number.isRequired,
};

export default FiltrosIlustraciones;
