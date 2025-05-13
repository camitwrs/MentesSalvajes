import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@heroui/button";
import { getCuestionarioPorIdRequest } from "../../api/cuestionarios";
import GestionSesiones from "../components/GestionSesiones";

const SesionesPage = () => {
  const { idcuestionario } = useParams();
  const navigate = useNavigate();
  const [cuestionario, setCuestionario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCuestionario = async () => {
      try {
        setLoading(true);
        const response = await getCuestionarioPorIdRequest(idcuestionario);
        setCuestionario(response.data);
      } catch (err) {
        console.error("Error al cargar el cuestionario:", err);
        setError("No se pudo cargar la información del cuestionario");
      } finally {
        setLoading(false);
      }
    };

    fetchCuestionario();
  }, [idcuestionario]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-6 bg-gray-50">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 h-screen">
      <div className="flex items-center mb-6">
        <Button
          color="default"
          size="md"
          onPress={handleBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          Gestión de Sesiones:{" "}
          <span className="font-normal">
            {cuestionario?.titulocuestionario}
          </span>
        </h1>
      </div>

      <GestionSesiones idcuestionario={idcuestionario} />
    </div>
  );
};

export default SesionesPage;
