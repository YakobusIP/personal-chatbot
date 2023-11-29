import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Login from "@/pages/Login";
import ProtectedRoutes from "./context/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
