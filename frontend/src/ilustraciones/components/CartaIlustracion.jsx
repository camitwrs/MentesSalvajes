import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Upload } from "lucide-react";
import { useState } from "react";
import { getAllIlustracionesRequest } from "../../api/ilustraciones";
import { useEffect } from "react";

const CartaIlustracion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState(null);
  const [ilustraciones, setIlustraciones] = useState([]);

  const handleOpenModal = (tarjeta) => {
    setModalContent(tarjeta);
    onOpen();
  };

  useEffect(() => {
    getAllIlustracionesRequest()
      .then((response) => {
        setIlustraciones(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las ilustraciones:", error);
      });
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <div className="p-4">
      {/* Grid con las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ilustraciones.length > 0 ? (
          ilustraciones.map((tarjeta) => (
            <Card
              key={tarjeta.idilustracion}
              className="rounded-md border border-gray-300 shadow-md"
            >
              <CardHeader>
                <h2 className="text-lg font-bold">
                  {tarjeta.titulollustracion}
                </h2>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Estado:</strong> {tarjeta.estadollustracion}
                </p>
                <p>
                  <strong>Fecha de solicitud:</strong>{" "}
                  {new Date(
                    tarjeta.fechaasignacionllustracion
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Fecha de carga:</strong>{" "}
                  {tarjeta.fechacargallustracion
                    ? new Date(
                        tarjeta.fechacargallustracion
                      ).toLocaleDateString()
                    : "No disponible"}
                </p>
              </CardBody>
              <CardFooter className="flex justify-end">
                <button
                  className="flex items-center bg-Moonstone text-white py-2 px-4 rounded-md"
                  onClick={() => handleOpenModal(tarjeta)}
                >
                  Ver más
                </button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center text-xl col-span-4 text-gray-500">
            No hay ilustraciones disponibles por el momento :(
          </p>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="fixed inset-0 flex items-start justify-center"
      >
        <ModalContent
          className={`fixed top-0 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white shadow-lg 
                max-h-[60vh] overflow-y-auto rounded-t-lg 
                transform transition-transform duration-300 ease-out 
                ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
        >
          <ModalHeader>
            <h2 className="text-lg font-bold">
              {modalContent?.titulollustracion}
            </h2>
          </ModalHeader>
          <ModalBody className="text-gray-500">
            <p>
              <strong>Estado:</strong> {modalContent?.estadollustracion}
            </p>
            <p>
              <strong>Fecha de solicitud:</strong>{" "}
              {modalContent?.fechaasignacionllustracion
                ? new Date(
                    modalContent.fechaasignacionllustracion
                  ).toLocaleDateString()
                : "No disponible"}
            </p>
            <p>
              <strong>Fecha de carga:</strong>{" "}
              {modalContent?.fechacargallustracion
                ? new Date(
                    modalContent.fechacargallustracion
                  ).toLocaleDateString()
                : "No disponible"}
            </p>
            <p>{modalContent?.descripcionllustracion}</p>
          </ModalBody>
          <ModalFooter>
            <button className="w-full bg-Moonstone text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Ilustración
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CartaIlustracion;
