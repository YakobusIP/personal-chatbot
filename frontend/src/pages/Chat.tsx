import { Flex, Spinner, useToast } from "@chakra-ui/react";
import RootLayout from "../components/RootLayout";
import { useParams } from "react-router-dom";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Socket } from "socket.io-client";

interface Message {
  chatId: string;
  id: string;
  author: string;
  content: string;
}

interface Props {
  socket: Socket;
}

enum ChatRole {
  USER = "Me",
  CHATBOT = "ChatGPT"
}

export default function Chat({ socket }: Props) {
  const toast = useToast();
  const { id } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChatHistory = useCallback(
    async (chatId: string) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/chat/${chatId}`
        );

        const messageArray = response.data.data as Message[];

        messageArray.map((message) => {
          setMessages((prevMessage) => [
            ...prevMessage,
            {
              chatId: message.chatId,
              id: message.id,
              author: message.author,
              content: message.content
            }
          ]);
        });
      } catch (error) {
        toast({
          title: "Error",
          status: "error",
          duration: 2000,
          position: "top"
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchChatHistory(id as string);
  }, [fetchChatHistory, id]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      setMessages((prevMessages) => {
        const existingMessageIndex = prevMessages.findIndex(
          (message) => message.id === data.id
        );

        if (existingMessageIndex !== -1) {
          // Message already exists, update its content
          return [
            ...prevMessages.slice(0, existingMessageIndex),
            {
              ...prevMessages[existingMessageIndex],
              content: prevMessages[existingMessageIndex].content.concat(
                data.content
              )
            },
            ...prevMessages.slice(existingMessageIndex + 1)
          ];
        } else {
          // Message doesn't exist, add it to the array
          setLoading(false);
          return [
            ...prevMessages,
            {
              chatId: data.chatId,
              id: data.id,
              author: data.author,
              content: data.content
            }
          ];
        }
      });
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const sendMessage = (input: string) => {
    setLoading(true);
    if (input.length > 0) {
      const socketMessage: Message[] = [];

      if (messages.length > 0) {
        const oldMessage: Message = {
          chatId: messages[messages.length - 1].chatId,
          id: messages[messages.length - 1].id,
          author: messages[messages.length - 1].author,
          content: messages[messages.length - 1].content
        };

        socketMessage.push(oldMessage);
      }

      const data: Message = {
        chatId: id as string,
        id: uuidv4(),
        author: ChatRole.USER,
        content: input
      };

      socketMessage.push(data);

      setMessages((prevMessage) => [
        ...prevMessage,
        {
          chatId: data.chatId,
          id: uuidv4(),
          author: data.author,
          content: data.content
        }
      ]);

      socket.emit("send_message", socketMessage);
    }
  };

  return (
    <RootLayout>
      <Flex
        direction={"column"}
        h={"full"}
        grow={1}
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
        overflow={"auto"}
      >
        {messages.map((message) => {
          return (
            <ChatMessage
              key={message.id}
              author={message.author}
              content={message.content}
            />
          );
        })}
        {loading && <Spinner />}
      </Flex>
      <ChatInput sendInput={(input) => sendMessage(input)} />
    </RootLayout>
  );
}
