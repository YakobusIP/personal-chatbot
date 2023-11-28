import { ChatRole } from "@/enum/chatrole.enum";
import { Avatar, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import Markdown from "react-markdown";

interface Props {
  author: string;
  content: string;
}

interface ComponentProps {
  children: React.ReactNode;
}

export default function ChatMessage({ author, content }: Props) {
  const { colorMode } = useColorMode();
  const cleanUL = content.replaceAll(/\n\n-/g, "\n-");
  const cleanOL = cleanUL.replaceAll(/\n\s*\n(\d+)/g, "\n$1");

  const components: React.FC<ComponentProps> = (props) => {
    return (
      <pre
        style={{
          backgroundColor: colorMode === "dark" ? "#2d2d2d" : "#f5f5f5",
          padding: "1rem",
          borderRadius: "0.5rem"
        }}
      >
        {props.children}
      </pre>
    );
  };
  return (
    <Flex
      direction={"column"}
      position={"sticky"}
      w={"50%"}
      bottom={0}
      justifyContent={"center"}
      py={8}
      px={8}
      rowGap={4}
    >
      <Flex alignItems={"center"} columnGap={4}>
        <Avatar
          name={author}
          size={"sm"}
          src={author === ChatRole.CHATBOT ? "/gpt-black-logo.jpg" : undefined}
        />
        <Heading fontSize={20}>{author}</Heading>
      </Flex>
      <Text whiteSpace={"pre-wrap"}>
        {/* @ts-expect-error Unknown props type on react markdown */}
        <Markdown unwrapDisallowed={true} components={{ pre: components }}>
          {cleanOL}
        </Markdown>
      </Text>
    </Flex>
  );
}
