import { createContext, useState, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface IChatTopicContext {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
}

const initialValue: IChatTopicContext = {
  topic: "",
  setTopic: () => null
};

const ChatTopicContext = createContext<IChatTopicContext>(initialValue);

const ContextProvider = ({ children }: Props) => {
  const [topic, setTopic] = useState(initialValue.topic);

  return (
    <ChatTopicContext.Provider value={{ topic, setTopic }}>
      {children}
    </ChatTopicContext.Provider>
  );
};

export { ChatTopicContext, ContextProvider };
