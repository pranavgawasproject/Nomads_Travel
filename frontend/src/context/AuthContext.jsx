import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({
  auth: {
    user: null,
    accessToken: "",
  },
  setAuth: () => {},
});

export default function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    accessToken: "",
  });


  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
