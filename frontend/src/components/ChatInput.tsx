import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { IoIosSend } from "react-icons/io";

export default function ChatInput() {
  return (
    <Flex
      position={"sticky"}
      w={"60%"}
      bottom={0}
      justifyContent={"center"}
      p={8}
      bgColor={"main"}
    >
      <InputGroup>
        <Input />
        <InputRightElement _hover={{ cursor: "pointer" }}>
          <Icon as={IoIosSend} boxSize={6} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
