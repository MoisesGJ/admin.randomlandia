"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { magicLink } from "./actions";

import { AuthOptions, AuthVerify } from "./actions";

import { startAuthentication } from "@simplewebauthn/browser";

export default function Login() {
  const router = useRouter();

  const [state, setState] = useState({ message: "", errors: {} });
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      setLoading(true);
      let result;

      if (action === "magic-link") {
        result = await magicLink(formData);
      } else if (action === "biometric") {
        result = await AuthOptions(formData);
      }

      await delay(1500);
      setLoading(false);

      if (!result.success) {
        setState({
          message: result?.errors?.global || "",
          errors: result?.errors || null,
        });
        await delay(1500);
        setState({ message: "", errors: result?.errors || null });
      } else {
        if (result.options) {
          const options = result.options;

          const attResp = await startAuthentication(options);

          if (!attResp) {
            setState({
              message: attResp.errors?.global || "Error al recuperar opciones",
              errors: {},
            });
          }

          const authenticationResp = await AuthVerify(options, attResp);

          if (!authenticationResp) {
            setState({
              message:
                authenticationResp.errors?.global || "Credenciales inválidas",
              errors: {},
            });
          }

          router.push(authenticationResp.redirect);
        } else {
          setState({
            globalSuccess:
              result.global || "¡Revisa tu correo para iniciar sesión!",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setState({ message: "Hubo un error.", errors: {} });

      await delay(1500);
      setState({ message: "", errors: {} });
    }
  };

  return (
    <main className="fix-h-screen w-screen flex flex-col justify-center items-center bg-white md:bg-blue relative overflow-hidden">
      {loading && (
        <div className="absolute z-10 top-0 start-0 fix-h-screen w-screen font-bold text-blue-text md:text-white text-4xl backdrop-blur-sm flex justify-center mt-16">
          Cargando...
        </div>
      )}

      {state.globalSuccess && (
        <div className="absolute text-white top-0 mt-12 bg-green-600 p-5 rounded-lg font-bold">
          {state.globalSuccess}
        </div>
      )}

      {state.message && (
        <div className="absolute text-white top-0 mt-12 bg-red-600 p-5 rounded-lg font-bold">
          {state.message}
        </div>
      )}

      <form
        className={`p-5 bg-white rounded-none md:rounded-tr-3xl md:rounded-bl-3xl w-full md:h-96 md:w-6/12 flex flex-col justify-center items-center ${
          state?.errors?.user || state?.errors?.password ? "gap-8" : "gap-5"
        }`}
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl my-5 font-semibold">Inicia sesión</h1>

        <div className="relative w-full max-w-96">
          {state?.errors?.email && (
            <ErrorMessage message={state.errors.email} />
          )}
          <input
            type="email"
            name="email"
            className="border-[1.5px] border-blue rounded-md w-full p-3 text-blue-text"
            placeholder="Correo electrónico"
            required
          />
        </div>

        <h2>Autenticación sin contraseñas</h2>

        <button
          type="submit"
          name="action"
          value="magic-link"
          className="border-[1.5px] p-2 border-blue hover:bg-blue hover:text-white hover:font-bold rounded-md w-full max-w-48"
          onClick={() => setAction("magic-link")}
        >
          Enviar correo
        </button>
        <button
          type="submit"
          name="action"
          value="biometric"
          className="border-[1.5px] p-2 border-blue hover:bg-blue hover:text-white hover:font-bold rounded-md w-full max-w-48"
          onClick={() => setAction("biometric")}
        >
          Biométricos
        </button>
      </form>
    </main>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="text-red-500 absolute -top-7 text-sm whitespace-nowrap">
      {message}
    </p>
  );
}
