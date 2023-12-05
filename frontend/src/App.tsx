import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import { ContextProvider } from "./context/ContextProvider";

function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
