"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  user: z.string().min(2, {
    message: "El usuario debe tener al menos 2 caracteres.",
  }),
  password: z
    .string()
    .min(2, { message: "La contraseña debe tener al menos 2 caracteres." }),
});

export default function Login() {
  const router = useRouter(); // Utiliza useRouter() aquí

  const [state, setState] = useState({ message: "", errors: {} });
  const [showPassword, setShowPassword] = useState(false);

  const [messageState, setMessageState] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {});

      setState({ message: "", errors });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setState({ message: result.message, errors: {} });
        router.push("/dashboard/");
      } else {
        setMessageState(true);
        setState({ message: "Credenciales inválidas", errors: result.errors });

        setTimeout(() => {
          setMessageState(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setState({ message: "Error de red.", errors: {} });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fix-h-screen w-screen flex justify-center items-center bg-blue relative overflow-hidden">
      {loading && (
        <div className="absolute z-10 top-0 start-0 h-screen w-screen font-bold text-blue-text md:text-white text-4xl backdrop-blur-sm flex justify-center mt-16">
          Cargando...
        </div>
      )}

      {messageState && state.message && (
        <div className="absolute text-white top-0 mt-12 bg-red-600 p-5 rounded-lg font-bold">
          {state.message}
        </div>
      )}

      <form
        className={`p-5 bg-white rounded-none md:rounded-2xl w-full fix-h-screen md:h-96 md:w-6/12 flex flex-col justify-center items-center ${
          state?.errors?.user || state?.errors?.password ? "gap-8" : "gap-5"
        }`}
        onSubmit={handleSubmit}
      >
        <h1 className="text-4xl mb-5 font-semibold">Inicia sesión</h1>

        <div className="relative w-full max-w-96">
          {state?.errors?.user && <ErrorMessage message={state.errors.user} />}
          <input
            type="text"
            name="user"
            className="border-[1.5px] border-blue rounded-md w-full p-3 text-blue-text"
            placeholder="Usuario"
          />
        </div>

        <div className="relative w-full max-w-96">
          {state?.errors?.password && (
            <ErrorMessage message={state.errors.password} />
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="border-[1.5px] border-blue rounded-md w-full p-3 text-blue-text"
              placeholder="Contraseña"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-text"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="fill-blue-text"
                >
                  <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="fill-blue-text"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <input
          type="submit"
          value="Iniciar sesión"
          className="border-[1.5px] p-2 border-blue hover:bg-blue hover:text-white hover:font-bold rounded-md w-full max-w-48"
        />
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
