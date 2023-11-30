import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import { ChatTopicProvider } from "./context/ChatTopicContext";

function App() {
  return (
    <ChatTopicProvider>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </ChatTopicProvider>
  );
}

export default App;
