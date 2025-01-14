import React, { useState } from "react";
import ListIllustrations from "../components/ListIllustrations";
import InstructionsIllustration from "../components/InstructionsIllustration";
import ApproveIllustration from "../components/ApproveIllustration";

const VistaJefeDiseno = () => {
  const [selectedIllustration, setSelectedIllustration] = useState(null);
  const [currentView, setCurrentView] = useState("list"); // 'list', 'details', 'approve'

  // Ejemplo de ilustraciones para el diseñador jefe
  const ilustraciones = [
    {
      id: 1,
      nombre: "Ilustración A",
      proyecto: "Proyecto X",
      estado: "Pendiente",
      descripcion: "Esta ilustración requiere detalles específicos.",
      fechaLimite: "2024-12-01",
    },
    {
      id: 2,
      nombre: "Ilustración B",
      proyecto: "Proyecto Y",
      estado: "Pendiente",
      descripcion: "Revisión urgente para presentación.",
      fechaLimite: "2024-12-05",
    },
  ];

  // Función para manejar la selección de una ilustración
  const handleSelectIllustration = (id) => {
    const ilustracion = ilustraciones.find((i) => i.id === id);
    setSelectedIllustration(ilustracion);
    setCurrentView("details");
  };

  // Función para aprobar ilustración
  const handleApprove = (id, comments) => {
    console.log(`Ilustración ${id} aprobada con comentarios: ${comments}`);
    setSelectedIllustration(null);
    setCurrentView("list");
  };

  // Función para rechazar ilustración
  const handleReject = (id, comments) => {
    console.log(`Ilustración ${id} rechazada con comentarios: ${comments}`);
    setSelectedIllustration(null);
    setCurrentView("list");
  };

  // Renderizado según la vista actual
  return (
    <div className="container mx-auto mt-8">
      {currentView === "list" && (
        <ListIllustrations
          ilustraciones={ilustraciones}
          onSelect={handleSelectIllustration}
        />
      )}

      {currentView === "details" && selectedIllustration && (
        <InstructionsIllustration
          ilustracion={selectedIllustration}
          onBack={() => setCurrentView("list")}
        />
      )}

      {currentView === "approve" && selectedIllustration && (
        <ApproveIllustration
          ilustracion={selectedIllustration}
          onApprove={handleApprove}
          onReject={handleReject}
          onBack={() => setCurrentView("list")}
        />
      )}
    </div>
  );
};

export default VistaJefeDiseno;
