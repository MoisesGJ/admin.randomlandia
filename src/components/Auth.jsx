import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch("/api/check-session");
          if (response.ok) {
            setAuthenticated(true);
          } else {
            router.push("/login");
          }
        } catch (error) {
          console.error("Error checking session:", error);
          router.push("/login");
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) return <p>Cargando...</p>;

    return authenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
