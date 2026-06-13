import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefresh from "../hooks/useRefresh";
import useAuth from "../hooks/useAuth";
import Loading from "../pages/Loading";

export default function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefresh();
  const { auth } = useAuth();

  console.log("persist login")
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!auth?.accessToken) {
          await refresh();
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();
  }, []);  

  return isLoading ? <Loading /> : <Outlet />;
}

