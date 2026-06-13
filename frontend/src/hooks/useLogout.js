import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/axios";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

export default function useLogout() {
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const user = auth.user;

  const logout = async () => {
    try {
      await api.get("auth/logout", {
        withCredentials: true,
      });
      showSuccessAlert("Logged out");
      setAuth((prevState) => {
        return {
          ...prevState,
          accessToken: "",
          user: null,
        };
      });

      // navigate("/login");
    } catch (error) {
      showErrorAlert(error.message);
    }
  };
  return logout;
}
