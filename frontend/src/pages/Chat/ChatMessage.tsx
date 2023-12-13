import { Avatar, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import Markdown from "react-markdown";

type Props = {
  author: string;
  content: string;
};

type ComponentProps = {
  children: React.ReactNode;
};

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
      w={{ base: "full", lg: "50%" }}
      bottom={0}
      justifyContent={"center"}
      py={8}
      px={8}
      rowGap={4}
      lineHeight={"40px"}
    >
      <Flex alignItems={"center"} columnGap={4}>
        <Avatar
          name={author === "USER" ? "Me" : "ChatGPT"}
          size={"sm"}
          src={author === "CHATBOT" ? "/gpt-black-logo.jpg" : undefined}
        />
        <Heading fontSize={20}>{author === "USER" ? "Me" : "ChatGPT"}</Heading>
      </Flex>
      {author === "CHATBOT" ? (
        /* @ts-expect-error Unknown props type on react markdown */
        <Markdown unwrapDisallowed={true} components={{ pre: components }}>
          {cleanOL}
        </Markdown>
      ) : (
        <Text whiteSpace={"pre-wrap"}>{content}</Text>
      )}
    </Flex>
  );
}
