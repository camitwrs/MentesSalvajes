import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { PlusCircle, KeyRound } from "lucide-react";
import CodigoSesionModal from "../components/CodigoSesionModal";
import ListaSesiones from "../components/ListaSesiones";
import { useNavigate } from "react-router-dom";
import { getSesionesPorCuestionarioRequest } from "../../api/sesiones";

const GestionSesiones = ({ idcuestionario }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSesiones = async () => {
      if (!idcuestionario) return;

      try {
        setLoading(true);
        const response = await getSesionesPorCuestionarioRequest(
          idcuestionario
        );
        setSesiones(response.data);
      } catch (err) {
        console.error("Error al cargar las sesiones:", err);
        setError("No se pudieron cargar las sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSesiones();
  }, [idcuestionario]);

  const handleCrearSesion = (nuevaSesion) => {
    setSesiones([...sesiones, nuevaSesion]);
  };

  const handleEliminarSesion = (idsesion) => {
    setSesiones((prevSesiones) =>
      prevSesiones.filter((sesion) => sesion.idsesion !== idsesion)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">
          Cargando códigos de sesión...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <KeyRound className="w-5 h-5 mr-2 text-blue-500" />
          Sesiones del Cuestionario
        </h2>
        <Button
          color="secondary"
          onPress={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-white"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Sesión</span>
        </Button>
      </div>

      <div className="mt-4">
        <ListaSesiones
          sesiones={sesiones}
          onDeleteSession={handleEliminarSesion}
        />
      </div>

      <CodigoSesionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cuestionarioId={idcuestionario}
        onSessionCreated={handleCrearSesion}
      />
    </div>
  );
};

export default GestionSesiones;
