import { Flex } from "@chakra-ui/react";
import RootLayout from "../components/RootLayout";
import { useParams } from "react-router-dom";
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";

export default function Chat() {
  const { id } = useParams();

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
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
      </Flex>
      <ChatInput />
    </RootLayout>
  );
}
