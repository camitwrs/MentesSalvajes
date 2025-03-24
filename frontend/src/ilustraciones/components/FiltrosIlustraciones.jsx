import { Button } from "@heroui/button"
import { Clock, CheckCircle, Filter } from "lucide-react"
import PropTypes from "prop-types"

const FiltrosIlustraciones = ({ estadoFiltro, setEstadoFiltro, total, pendientes, completadas }) => {
  const filtros = [
    {
      key: "todas",
      label: "Todas",
      icon: <Filter className="w-4 h-4" />,
      count: total,
    },
    {
      key: "pendientes",
      label: "Pendientes",
      icon: <Clock className="w-4 h-4" />,
      count: pendientes,
    },
    {
      key: "completadas",
      label: "Completadas",
      icon: <CheckCircle className="w-4 h-4" />,
      count: completadas,
    },
  ]

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1 w-full sm:w-auto sm:inline-flex">
      {filtros.map((filtro) => {
        const activo = estadoFiltro === filtro.key
        return (
          <Button
            key={filtro.key}
            variant="light"
            className={`rounded-md px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center sm:justify-start ${
              activo ? "bg-white border border-gray-300 shadow-sm text-black" : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setEstadoFiltro(filtro.key)}
            startContent={filtro.icon}
            size="sm"
          >
            <span className="text-xs sm:text-sm">{filtro.label}</span>
            <span className="ml-1 bg-gray-200 text-gray-800 rounded-full px-1.5 sm:px-2 py-0.5 text-xs font-semibold">
              {filtro.count}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

FiltrosIlustraciones.propTypes = {
  estadoFiltro: PropTypes.string.isRequired,
  setEstadoFiltro: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  pendientes: PropTypes.number.isRequired,
  completadas: PropTypes.number.isRequired,
}

export default FiltrosIlustraciones