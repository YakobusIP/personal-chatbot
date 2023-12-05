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
        const response = await axiosClient.get(`/chat/history/${chatId}`);

        const messageArray = response.data.data as Message[];

        setTopic(response.data.topic);

        messageArray.map((message) => {
          setMessages((prevMessage) => [
            ...prevMessage,
            {
              id: message.id,
              author: message.author,
              content: message.content,
              conversationQuestionId: message.conversationQuestionId,
              conversationAnswerId: message.conversationAnswerId
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
        id: "",
        author: "USER",
        content: input,
        conversationQuestionId: null,
        conversationAnswerId: null
      };

      setMessages((prevMessage) => [
        ...prevMessage,
        {
          id: data.id,
          author: data.author,
          content: data.content,
          conversationQuestionId: data.conversationQuestionId,
          conversationAnswerId: data.conversationAnswerId
        }
      ]);

      const events = new EventSource(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/chat/answer-question?chatId=${
          id as string
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
            (message) =>
              message.conversationQuestionId && message.id.length === 0
          );

          if (questionIndex !== -1) {
            return [
              ...prevMessages.slice(0, questionIndex),
              {
                ...prevMessages[questionIndex],
                conversationQuestionId: data.conversationId
              },
              ...prevMessages.slice(questionIndex + 1)
            ];
          } else {
            const answerIndex = prevMessages.findIndex(
              (message) => message.conversationAnswerId === data.conversationId
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
                  id: "",
                  author: "CHATBOT",
                  content: data.data,
                  conversationQuestionId: null,
                  conversationAnswerId: data.conversationId
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
