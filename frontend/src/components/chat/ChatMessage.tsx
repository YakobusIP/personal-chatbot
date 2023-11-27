import { ChatRole } from "@/enum/chatrole.enum";
import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import Markdown from "react-markdown";

interface Props {
  author: string;
  content: string;
}

export default function ChatMessage({ author, content }: Props) {
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
        <Markdown>{content}</Markdown>
      </Text>
    </Flex>
  );
}
