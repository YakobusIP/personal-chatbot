import {
  Button,
  Flex,
  Icon,
  useColorMode,
  useToast,
  useBreakpointValue
} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import RootLayout from "@/components/RootLayout";
import ChatInput from "@/pages/Chat/ChatInput";
import ChatMessage from "@/pages/Chat/ChatMessage";
import Message from "@/types/message.type";
import { IoMdArrowDown } from "react-icons/io";
import { AxiosError, HttpStatusCode } from "axios";
import { GlobalContext } from "@/context/ContextProvider";
import Chunk from "@/types/chunk.type";
import {
  addAnswerToList,
  addMessageToList,
  appendAnswerChunk,
  sleep,
  updateQuestionId
} from "./ChatService";
import { createNewQuestion, getChatHistory } from "@/context/chat/api";

export default function Chat() {
  const toast = useToast();
  const location = useLocation();

  const { id } = useParams();
  const chatId = id as string;

  const { colorMode } = useColorMode();
  const isLg = useBreakpointValue({ base: false, lg: true });
  const { setTopic } = useContext(GlobalContext);

  const [messages, setMessages] = useState<Message[]>([]);

  const fetchChatHistory = useCallback(
    async (chatId: string) => {
      try {
        const data = await getChatHistory(chatId);

        const messageArray = data.data.history as Message[];

        setTopic(data.data.topic);

        messageArray.map((message) => {
          setMessages((prevMessage) =>
            addMessageToList(
              prevMessage,
              message.id,
              message.author,
              message.content,
              message.conversationQuestionId,
              message.conversationAnswerId
            )
          );
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
    fetchChatHistory(chatId);
  }, [fetchChatHistory, chatId, location]);

  const sendMessage = async (input: string) => {
    if (input.length > 0) {
      const data: Message = {
        id: "",
        author: "USER",
        content: input,
        conversationQuestionId: null,
        conversationAnswerId: null
      };

      setMessages((prevMessage) =>
        addMessageToList(
          prevMessage,
          data.id,
          data.author,
          data.content,
          data.conversationQuestionId,
          data.conversationAnswerId
        )
      );

      const status = await createNewQuestion(chatId, data.content);

      if (status === HttpStatusCode.Ok) {
        await sleep(5000);
        const events = new EventSource(
          `${import.meta.env.VITE_BASE_AXIOS_URL}/event/sse?chatId=${chatId}`
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
              return updateQuestionId(
                prevMessages,
                questionIndex,
                data.conversationId
              );
            } else {
              const answerIndex = prevMessages.findIndex(
                (message) =>
                  message.conversationAnswerId === data.conversationId
              );

              if (answerIndex !== -1) {
                scrollToBottom();

                if (data.data === "[DONE]") {
                  return prevMessages;
                } else {
                  return appendAnswerChunk(
                    prevMessages,
                    answerIndex,
                    data.data
                  );
                }
              } else {
                return addAnswerToList(
                  prevMessages,
                  data.data,
                  data.conversationId
                );
              }
            }
          });
        };
      }
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
