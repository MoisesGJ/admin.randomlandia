import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentProfile } from "@/app/dashboard/actions";

const ContextSession = createContext();

export const Provider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const profile = await getCurrentProfile();
        setSession(profile);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <ContextSession.Provider value={session}>
      {children}
    </ContextSession.Provider>
  );
};

export const useContextSession = () => useContext(ContextSession);
