import { Flex, Heading } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex
      position={"sticky"}
      w={"full"}
      top={0}
      justifyContent={"center"}
      p={4}
      bgColor={"navbar"}
      color={"white"}
    >
      <Heading>Personal Chatbot</Heading>
    </Flex>
  );
}
