import { Flex, Heading, Text } from "@chakra-ui/react";

interface Props {
  author: string;
  content: string;
}

export default function ChatMessage({ author, content }: Props) {
  return (
    <Flex
      direction={"column"}
      position={"sticky"}
      w={"60%"}
      bottom={0}
      justifyContent={"center"}
      p={8}
      rowGap={2}
    >
      <Heading fontSize={20}>{author}</Heading>
      <Text whiteSpace={"pre-wrap"}>{content}</Text>
    </Flex>
  );
}
