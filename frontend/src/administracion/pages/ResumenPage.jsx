import {Chip} from "@heroui/chip";
import { ArrowLeft } from "lucide-react";

const ResumenPage = () => {
    return (
        <div className="flex items-center space-x-2 p-4">
          <ArrowLeft className="w-5 h-5" />
          <h1 className="text-xl font-bold">Cuesionario 8.0</h1>
          <Chip className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-black text-white">Activo</Chip>
        </div>
      )
}

export default ResumenPage
