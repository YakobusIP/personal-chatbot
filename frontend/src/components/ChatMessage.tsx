import { Flex, Heading, Text } from "@chakra-ui/react";

interface Props {
  author: string;
  id: string;
  content: string;
}

export default function ChatMessage({ author, id, content }: Props) {
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
      <Text>{id}</Text>
      <Text>{content}</Text>
    </Flex>
  );
}
