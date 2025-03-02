import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
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
    titulo: "Mountain Escape",
    estado: "En Proceso",
    fechaSolicitud: "2024-02-10",
  },
];

const CartaIlustracion = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleOpenModal = (tarjeta) => {
    setModalContent(tarjeta);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent(null);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {datosEnDuro.map((tarjeta) => (
          <Card key={tarjeta.id} className="rounded-md">
            <CardHeader>
              <h2 className="text-lg font-bold">{tarjeta.titulo}</h2>
            </CardHeader>
            <CardBody>
              <p><strong>Estado:</strong> {tarjeta.estado}</p>
              <p><strong>Fecha de solicitud:</strong> {tarjeta.fechaSolicitud}</p>
              <p><strong>Fecha de carga:</strong> 2024-02-22</p>
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
        ))}
      </div>

      <Modal isOpen={openModal} onClose={handleCloseModal}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-bold">{modalContent?.titulo}</h2>
          </ModalHeader>
          <ModalBody>
            <p><strong>Estado:</strong> {modalContent?.estado}</p>
            <p><strong>Fecha de solicitud:</strong> {modalContent?.fechaSolicitud}</p>
            <p><strong>Fecha de carga:</strong> 2024-02-22</p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste 
              nihil voluptatibus totam temporibus, magni officiis. Voluptas earum 
              explicabo dignissimos ratione nemo dolores debitis! Sed voluptas 
              aspernatur sint veniam suscipit officiis?
            </p>
          </ModalBody>
          <ModalFooter>
            <button 
              className="bg-red-500 text-white py-2 px-4 rounded-md" 
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CartaIlustracion;
