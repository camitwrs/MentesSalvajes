import CartaIlustracion from "../components/CartaIlustracion";

function IlustradorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Título */}
      <h1 className="font-bold text-lg sm:text-2xl text-center sm:text-left mb-6">
        Ilustraciones Pendientes
      </h1>
      
      <CartaIlustracion />
    </div>
  );
}

export default IlustradorPage;
