import {
  Button,
  Flex,
  Icon,
  useColorMode,
  useToast,
  useBreakpointValue
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useLocation, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import RootLayout from "@/components/RootLayout";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import Message from "@/types/message.type";
import { IoMdArrowDown } from "react-icons/io";
import { AxiosError } from "axios";
import { ChatTopicContext } from "@/context/ContextProvider";
import Chunk from "@/types/chunk.type";

export default function Chat() {
  const toast = useToast();
  const location = useLocation();

  const { id } = useParams();
  const { colorMode } = useColorMode();
  const isLg = useBreakpointValue({ base: false, lg: true });
  const { setTopic } = useContext(ChatTopicContext);

  const [messages, setMessages] = useState<Message[]>([]);

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
              content: message.content,
              questionId: message.questionId
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
    setMessages([]);
    fetchChatHistory(id as string);
  }, [fetchChatHistory, id, location]);

  const sendMessage = (input: string) => {
    if (input.length > 0) {
      const data: Message = {
        chatId: id as string,
        id: "",
        author: "USER",
        content: input,
        questionId: null
      };

      setMessages((prevMessage) => [
        ...prevMessage,
        {
          chatId: data.chatId,
          id: data.id,
          author: data.author,
          content: data.content,
          questionId: null
        }
      ]);

      const events = new EventSource(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/answer-question?chatId=${
          data.chatId
        }&content=${data.content}`
      );

      events.onmessage = (event) => {
        const data: Chunk = JSON.parse(event.data);

        if (data.data === "[DONE]") {
          events.close();
          scrollToBottom();
        }

        setMessages((prevMessages) => {
          const questionIndex = prevMessages.findIndex(
            (message) => message.id.length === 0
          );

          if (questionIndex !== -1) {
            return [
              ...prevMessages.slice(0, questionIndex),
              {
                ...prevMessages[questionIndex],
                id: data.questionId
              },
              ...prevMessages.slice(questionIndex + 1)
            ];
          } else {
            const answerIndex = prevMessages.findIndex(
              (message) => message.questionId === data.questionId
            );

            if (answerIndex !== -1) {
              scrollToBottom();

              if (data.data === "[DONE]") {
                return prevMessages;
              } else {
                return [
                  ...prevMessages.slice(0, answerIndex),
                  {
                    ...prevMessages[answerIndex],
                    content: prevMessages[answerIndex].content.concat(data.data)
                  },
                  ...prevMessages.slice(answerIndex + 1)
                ];
              }
            } else {
              return [
                ...prevMessages,
                {
                  chatId: id as string,
                  id: "",
                  author: "CHATBOT",
                  content: data.data,
                  questionId: data.questionId
                }
              ];
            }
          }
        });
      };
    }
  };

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
        {messages.map((message, index) => {
          return (
            <ChatMessage
              key={message.id + index}
              author={message.author}
              content={message.content}
            />
          );
        })}
      </Flex>
      <ChatInput sendInput={(input) => sendMessage(input)} />
      {isLg && (
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
      )}
    </RootLayout>
  );
}
