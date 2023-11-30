import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/chat/:id" element={<Chat />} />
    </Routes>
  );
}

export default App;
