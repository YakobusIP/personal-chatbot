import {
  Button,
  Flex,
  Icon,
  Spinner,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";
import RootLayout from "@/components/RootLayout";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import Message from "@/types/message.type";
import { ChatRole } from "@/enum/chatrole.enum";
import { IoMdArrowDown } from "react-icons/io";
import { AxiosError } from "axios";
import { ChatTopicContext } from "@/context/ChatTopicContext";

const socket = io(import.meta.env.VITE_BASE_WS_URL);

export default function Chat() {
  const toast = useToast();
  const { id } = useParams();
  const { colorMode } = useColorMode();
  const { setTopic } = useContext(ChatTopicContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const lastMessageTimeRef = useRef<number>();
  const quietTimePeriodTimeoutRef = useRef<NodeJS.Timeout>();

  const [quietPeriodPassed, setQuietPeriodPassed] = useState(false);

  const fetchChatHistory = useCallback(
    async (chatId: string) => {
      try {
        const response = await axiosClient.get(`/chat/${chatId}`);

        const messageArray = response.data.data as Message[];

        setTopic(response.data.topic);

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
        if (error instanceof AxiosError && error.response) {
          toast({
            title: "Error",
            description: error.response.data.message,
            status: "error",
            duration: 2000,
            position: "top"
          });
        }
      }
    },
    [toast, setTopic]
  );

  useEffect(() => {
    fetchChatHistory(id as string);
  }, [fetchChatHistory, id]);

  useEffect(() => {
    socket.on("receive_message", (data: Message) => {
      lastMessageTimeRef.current = Date.now();

      setQuietPeriodPassed(false);

      if (quietTimePeriodTimeoutRef.current) {
        clearTimeout(quietTimePeriodTimeoutRef.current);
      }

      quietTimePeriodTimeoutRef.current = setTimeout(() => {
        setQuietPeriodPassed(true);
      }, 3000);

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

      if (quietTimePeriodTimeoutRef.current) {
        clearTimeout(quietTimePeriodTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = (input: string) => {
    setLoading(true);
    if (input.length > 0) {
      const data: Message = {
        chatId: id as string,
        id: uuidv4(),
        author: ChatRole.USER,
        content: input
      };

      setMessages((prevMessage) => [
        ...prevMessage,
        {
          chatId: data.chatId,
          id: uuidv4(),
          author: data.author,
          content: data.content
        }
      ]);

      socket.emit("send_message", data);
    }
  };

  useEffect(() => {
    const sendRecentGPT = async () => {
      if (quietPeriodPassed) {
        try {
          const gptMessages = messages.filter(
            (message) => message.author === ChatRole.CHATBOT
          );
          const response = await axiosClient.post("/recent-message", {
            message: gptMessages[gptMessages.length - 1]
          });

          toast({
            title: "Success",
            description: response.data.message,
            status: "success",
            duration: 2000,
            position: "top"
          });
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            toast({
              title: "Error",
              description: error.response.data.message,
              status: "error",
              duration: 2000,
              position: "top"
            });
          }
        }
      }
    };

    sendRecentGPT();
  }, [messages, quietPeriodPassed, toast]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
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
      <Button
        position={"fixed"}
        zIndex={2}
        bottom={8}
        right={8}
        bgColor={colorMode === "dark" ? "navbar.dark" : "navbar.light"}
        height={"48px"}
        width={"48px"}
        borderRadius={"50%"}
        onClick={scrollToBottom}
      >
        <Icon as={IoMdArrowDown} boxSize={8} />
      </Button>
    </RootLayout>
  );
}
