import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authenticated) return navigate("/login");

  return <Outlet />;
}
