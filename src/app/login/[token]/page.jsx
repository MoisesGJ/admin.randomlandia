"use client";

import { useEffect, useState } from "react";
import { validateEmailKey } from "../actions";
import { useRouter } from "next/navigation";

export default function ValidatePage({ params }) {
  const router = useRouter();
  const { token } = params;
  const [message, setMessage] = useState("Cargando...");

  const handlerRouter = async (redirect) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push(redirect);
  };

  useEffect(() => {
    const handleValidation = async () => {
      let redirect = "/login";

      if (token) {
        try {
          const decoded = atob(decodeURIComponent(token));

          await validateEmailKey(decoded);

          setMessage("¡Validación exitosa!");
          redirect = "/dashboard";
        } catch (error) {
          console.error(error);
          setMessage("No es un token válido");
        }
      }

      await handlerRouter(redirect);
    };

    handleValidation();
  }, [token]);

  return <>{message}</>;
}
