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

const datosEnDuro = [
  {
    id: 1,
    titulo: "Fantasy Landscape",
    estado: "Pendiente",
    fechaSolicitud: "2024-02-20",
  },
  {
    id: 2,
    titulo: "Ocean View",
    estado: "Completado",
    fechaSolicitud: "2024-01-15",
  },
  {
    id: 3,
    titulo: "Mountain Escape",
    estado: "En Proceso",
    fechaSolicitud: "2024-02-10",
  },
  {
    id: 4,
    titulo: "Urban Skyline",
    estado: "Pendiente",
    fechaSolicitud: "2024-02-18",
  },
];

const CartaIlustracion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalContent, setModalContent] = useState(null);

  const handleOpenModal = (tarjeta) => {
    setModalContent(tarjeta);
    onOpen();
  };

  return (
    <div className="p-4">
      {/* Grid con las tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {datosEnDuro.length > 0 ? (
          datosEnDuro.map((tarjeta) => (
            <Card
              key={tarjeta.id}
              className="rounded-md border border-gray-300 shadow-md"
            >
              <CardHeader>
                <h2 className="text-lg font-bold">{tarjeta.titulo}</h2>
              </CardHeader>
              <CardBody>
                <p>
                  <strong>Estado:</strong> {tarjeta.estado}
                </p>
                <p>
                  <strong>Fecha de solicitud:</strong> {tarjeta.fechaSolicitud}
                </p>
                <p>
                  <strong>Fecha de carga:</strong> 2024-02-22
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
          <p className="text-center col-span-4 text-gray-500">
            No hay ilustraciones disponibles.
          </p>
        )}
      </div>

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
            <h2 className="text-lg font-bold">{modalContent?.titulo}</h2>
          </ModalHeader>
          <ModalBody className="text-gray-500">
            <p>
              <strong>Estado:</strong> {modalContent?.estado}
            </p>
            <p>
              <strong>Fecha de solicitud:</strong>{" "}
              {modalContent?.fechaSolicitud}
            </p>
            <p>
              <strong>Fecha de carga:</strong> 2024-02-22
            </p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
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
