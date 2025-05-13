import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Copy, CheckCircle } from "lucide-react";
import { useAlert } from "../../shared/context/AlertContext";
import { crearSesionRequest } from "../../api/sesiones";

const SessionCodeModal = ({
  isOpen,
  onClose,
  cuestionarioId,
  onSessionCreated,
}) => {
  const [nombreSesion, setNombreSesion] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const { showAlert } = useAlert();

  const generarCodigoRandom = () => {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitos = "0123456789";
    const todos = letras + digitos;

    let code = "";
    // Garantizar al menos una letra
    code += letras.charAt(Math.floor(Math.random() * letras.length));
    // Garantizar al menos un número
    code += digitos.charAt(Math.floor(Math.random() * digitos.length));
    // Agregar 4 caracteres aleatorios (letras o dígitos)
    for (let i = 0; i < 4; i++) {
      code += todos.charAt(Math.floor(Math.random() * todos.length));
    }
    // Mezclar los caracteres para que la letra y el dígito no siempre estén al principio
    return code
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleCrearSesion = async () => {
    if (!nombreSesion.trim()) {
      showAlert("Por favor ingresa un nombre para la sesión", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const code = generarCodigoRandom();

      await crearSesionRequest({
        idcuestionario: cuestionarioId,
        nombresesion: nombreSesion,
        codigosesion: code,
      });

      setTimeout(() => {
        setCodigoGenerado(code);
        setIsLoading(false);
        if (onSessionCreated) {
          onSessionCreated({
            codigosesion: code,
            nombresesion: nombreSesion,
          });
        }
        showAlert("Sesión creada exitosamente", "success");
      }, 1000);
    } catch (error) {
      console.error("Error al crear la sesión:", error);
      showAlert("Error al crear la sesión", "danger");
      setIsLoading(false);
    }
  };

  const handleCopiarCodigo = () => {
    navigator.clipboard.writeText(codigoGenerado);
    setCodigoCopiado(true);
    setTimeout(() => setCodigoCopiado(false), 2000);
  };

  const handleCerrar = () => {
    setNombreSesion("");
    setCodigoGenerado("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCerrar}>
      <ModalContent>
        <ModalHeader>
          {codigoGenerado ? "Código de Sesión Generado" : "Crear Nueva Sesión"}
        </ModalHeader>
        <ModalBody>
          {!codigoGenerado ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nombreSesion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de la instancia de evaluación
                </label>
                <Input
                  id="nombreSesion"
                  value={nombreSesion}
                  onChange={(e) => setNombreSesion(e.target.value)}
                  placeholder={nombreSesion}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Comparte este código con los participantes para que puedan
                unirse a la sesión:
              </p>
              <div className="flex items-center justify-center">
                <div className="bg-blue-50 text-blue-700 text-2xl font-bold py-3 px-6 rounded-lg tracking-widest">
                  {codigoGenerado}
                </div>
              </div>
              <button
                onClick={handleCopiarCodigo}
                className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 mx-auto mt-2"
              >
                {codigoCopiado ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar código</span>
                  </>
                )}
              </button>
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <strong>Importante:</strong> Guarda este código. Lo
                  necesitarás para ver las estadísticas específicas de esta
                  sesión.
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {!codigoGenerado ? (
            <>
              <Button color="secondary" onPress={handleCerrar} className="mr-2">
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleCrearSesion}
                isLoading={isLoading}
                className="text-white"
              >
                Crear Sesión
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              onPress={handleCerrar}
              className="text-white"
            >
              Cerrar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SessionCodeModal;
