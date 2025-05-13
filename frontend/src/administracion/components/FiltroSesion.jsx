import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getSesionesPorCuestionarioRequest } from "../../api/sesiones";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

// Utilidad para clases condicionales
const classNames = (...classes) => classes.filter(Boolean).join(" ");

const FiltroSesion = ({ onChange, idcuestionario }) => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); // "" = todas

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const response = await getSesionesPorCuestionarioRequest(
          idcuestionario
        );
        setSesiones(response.data || []);
      } catch (error) {
        console.error("Error cargando sesiones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idcuestionario) fetchSesiones();
  }, [idcuestionario]);

  const handleSelect = (selectedValue) => {
    setValue(selectedValue);
    onChange(selectedValue); // Emitir el código seleccionado al padre
    setOpen(false);
  };

  return (
    <div className="mb-6 w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={loading}
          className={classNames(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500",
            loading && "bg-gray-50 text-gray-400"
          )}
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-500" />
              <span>Cargando sesiones...</span>
            </div>
          ) : value ? (
            <span>
              {sesiones.find((s) => s.codigosesion === value)?.nombresesion ||
                value}
            </span>
          ) : (
            <span className="text-gray-500">Todas las respuestas</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>

        {open && !loading && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
            {/* Opción para ver todas las sesiones */}
            <div
              className={classNames(
                "cursor-pointer select-none py-1.5 pl-8 pr-2 hover:bg-gray-100 relative",
                value === "" && "bg-gray-100"
              )}
              onClick={() => handleSelect("")}
            >
              {value === "" && (
                <span className="absolute left-2 top-2.5">
                  <Check className="h-4 w-4 text-blue-600" />
                </span>
              )}
              Todas las respuestas
            </div>

            {/* Listado de sesiones */}
            {sesiones.map((sesion) => (
              <div
                key={sesion.codigosesion}
                className={classNames(
                  "cursor-pointer select-none py-1.5 pl-8 pr-2 hover:bg-gray-100 relative",
                  value === sesion.codigosesion && "bg-gray-100"
                )}
                onClick={() => handleSelect(sesion.codigosesion)}
              >
                {value === sesion.codigosesion && (
                  <span className="absolute left-2 top-2.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </span>
                )}
                Sesión: {sesion.nombresesion} - {sesion.codigosesion}
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && sesiones.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          No hay sesiones disponibles
        </p>
      )}
    </div>
  );
};

FiltroSesion.propTypes = {
  onChange: PropTypes.func.isRequired,
  idcuestionario: PropTypes.string.isRequired,
};

export default FiltroSesion;
