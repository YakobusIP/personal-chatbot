import { createContext, useState, ReactNode } from "react";
import { ChatContext } from "./chat/type";

interface Props {
  children: ReactNode;
}

export type GlobalContextType = ChatContext;

const initialValue: GlobalContextType = {
  rooms: [],
  setRooms: () => null,

  topic: "",
  setTopic: () => null
};

const GlobalContext = createContext<GlobalContextType>(initialValue);

const ContextProvider = ({ children }: Props) => {
  const [rooms, setRooms] = useState(initialValue.rooms);
  const [topic, setTopic] = useState(initialValue.topic);

  return (
    <GlobalContext.Provider value={{ rooms, setRooms, topic, setTopic }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, ContextProvider };
