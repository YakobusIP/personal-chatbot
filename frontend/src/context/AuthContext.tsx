import { axiosClient } from "@/lib/axios";
import { createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface IAuthContext {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const initialValue: IAuthContext = {
  authenticated: localStorage.getItem("token") ? true : false,
  setAuthenticated: () => null,
  username: "",
  setUsername: () => null
};

const AuthContext = createContext<IAuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );

  const [username, setUsername] = useState(initialValue.username);

  const navigate = useNavigate();

  axiosClient.interceptors.request.use((config) => {
    config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        return navigate("/login");
      }
    }
  );

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
