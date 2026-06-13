import { use } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  return use(AuthContext);
}
