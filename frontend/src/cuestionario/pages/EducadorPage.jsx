import Navbar from "../../shared/components/Navbar";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { ClipboardList, User } from "lucide-react";

const EducadorPage = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="flex justify-center gap-6 p-8">
        <Card className="w-[45rem] rounded-md">
          <CardHeader>
            <div className="flex items-center px-2 text-2xl">
              <ClipboardList className="w-5 h-5 mr-2 stroke-YankeesBlue" />
              <h2 className="font-bold text-YankeesBlue">
                Realizar Cuestionario
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-gray-500 px-2">
              Aquí puedes realizar un cuestionario para evaluar tus
              conocimientos.
            </p>
          </CardBody>
          <CardFooter className="px-4">
            <button className="flex items-center bg-YankeesBlue text-white py-2 px-4 rounded-md">
              Realizar Cuestionario
            </button>
          </CardFooter>
        </Card>

        <Card className="w-[45rem] rounded-md">
          <CardHeader>
            <div className="flex items-center px-2 text-2xl">
              <User className="w-5 h-5 mr-2 stroke-YankeesBlue" />
              <h2 className="font-bold text-YankeesBlue">Mi Perfil</h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-gray-500 px-2">
              Visualiza y edita la información de tu perfil de educador.
            </p>
          </CardBody>
          <CardFooter className="px-4">
            <button className="flex items-center bg-YankeesBlue text-white py-2 px-4 rounded-md">
              Ver Perfil
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EducadorPage;
