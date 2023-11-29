import { createContext, useState, ReactNode } from "react";

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

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, username, setUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
