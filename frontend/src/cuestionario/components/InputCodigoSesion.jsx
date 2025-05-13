"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import { validarCodigoSesionRequest } from "../../api/sesiones";

const InputCodigoSesion = ({ onCodeValidated, isOptional = true }) => {
  const [sessionCode, setSessionCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const validateCode = async () => {
    if (!sessionCode.trim()) {
      if (isOptional) {
        // Si es opcional y está vacío, simplemente continuamos
        onCodeValidated(null);
        return;
      } else {
        setValidationStatus("invalid");
        setErrorMessage("Por favor ingresa un código de sesión");
        return;
      }
    }

    setIsValidating(true);
    setValidationStatus(null);
    setErrorMessage("");

    try {
      const resultado = await validarCodigoSesionRequest(sessionCode);

      if (resultado.data.valido) {
        setValidationStatus("valid");
        onCodeValidated(sessionCode);
      } else {
        setValidationStatus("invalid");
        setErrorMessage("Código de sesión inválido");
      }
    } catch (error) {
      console.error("Error al validar el código:", error);
      setValidationStatus("invalid");
      setErrorMessage("Error al validar el código");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = () => {
    if (isOptional) {
      onCodeValidated(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
          <KeyRound className="w-5 h-5 mr-2 text-blue-500" />
          Código de Sesión
        </h3>
        <p className="text-sm text-gray-600">
          {isOptional
            ? "Si tienes un código de sesión proporcionado por tu instructor, ingrésalo aquí. Si no, puedes omitir este paso."
            : "Ingresa el código de sesión proporcionado por tu instructor para continuar."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-grow">
          <Input
            value={sessionCode}
            onChange={(e) => {
              setSessionCode(e.target.value.toUpperCase());
              setValidationStatus(null);
            }}
            placeholder="Ingresa el código (ej: ABC123)"
            className="w-full uppercase"
            maxLength={6}
          />
        </div>
        <Button
          color="success"
          onPress={validateCode}
          isLoading={isValidating}
          className="text-white"
        >
          Validar
        </Button>
        {isOptional && (
          <Button
            color="default"
            onPress={handleSkip}
            className="bg-gray-500 text-white"
          >
            Omitir
          </Button>
        )}
      </div>

      {validationStatus === "invalid" && (
        <div className="mt-2 text-red-600 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errorMessage}
        </div>
      )}

      {validationStatus === "valid" && (
        <div className="mt-2 text-green-600 text-sm flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Código válido
        </div>
      )}
    </div>
  );
};

export default InputCodigoSesion;
