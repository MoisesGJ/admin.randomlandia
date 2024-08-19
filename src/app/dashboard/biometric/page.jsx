"use client";

import { useContextSession } from "@/components/dashboard/Context";

import Title from "@/components/dashboard/title";
import { CreateOptions, CreateVerify } from "./actions";

import { startRegistration } from "@simplewebauthn/browser";

import { useState } from "react";

export default function RegisterBiometric() {
  const session = useContextSession();
  const [message, setMessage] = useState("");

  const registratePass = async () => {
    try {
      const data = await CreateOptions(session._id);

      if (!data.state) {
        return setMessage("Error al crear una contraseña");
      }

      const options = data.options;

      const attResp = await startRegistration(options);

      const verificationResp = await CreateVerify(
        attResp,
        options,
        session._id
      );

      if (verificationResp) {
        setMessage("¡Registro exitoso!");
      } else {
        setMessage(`Oh no, hubo un error: ${JSON.stringify(verificationResp)}`);
      }
    } catch (error) {
      if (error.name === "InvalidStateError") {
        setMessage("Error: Parece que ya se ha registrado este biométrico");
      } else {
        setMessage("Hubo un error. Reinténtelo.");
      }
      console.error("Error en la descarga de opciones", error);
    }
  };

  return (
    <>
      <Title text="Crear contraseña" />
      <section className="mt-12 flex">
        <button
          type="submit"
          className="p-5 bg-blue-text text-white rounded-3xl"
          onClick={registratePass}
        >
          Crear contraseña
        </button>
      </section>

      {message && (
        <p className="mt-12 bg-blue rounded-3xl p-5 text-white">{message}</p>
      )}
    </>
  );
}
