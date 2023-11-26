import {
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Textarea
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { IoIosSend } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface Props {
  sendInput: (input: string) => void;
}

export default function ChatInput({ sendInput }: Props) {
  const [input, setInput] = useState("");

  const pushInput = useCallback(
    (input: string) => {
      if (input.length > 0) {
        sendInput(input);
        setInput("");
      }
    },
    [sendInput]
  );

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        pushInput(input);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [input, pushInput]);

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
        <Input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <InputRightElement _hover={{ cursor: "pointer" }}>
          <Icon as={IoIosSend} boxSize={6} onClick={() => pushInput(input)} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
