import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";

const socket = io("http://localhost:4000");

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat/:id" element={<Chat socket={socket} />} />
    </Routes>
  );
}

export default App;
