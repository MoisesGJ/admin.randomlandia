import { useRouter } from "next/navigation";

function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return logout;
}

export default useLogout;
