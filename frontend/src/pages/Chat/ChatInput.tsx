import {
  Flex,
  Icon,
  InputGroup,
  InputRightElement,
  Textarea,
  useColorMode
} from "@chakra-ui/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { IoIosSend } from "react-icons/io";

interface Props {
  sendInput: (input: string) => void;
}

export default function ChatInput({ sendInput }: Props) {
  const { colorMode } = useColorMode();
  const [input, setInput] = useState("");
  const [overflow, setOverflow] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const pushInput = useCallback(
    (input: string) => {
      if (input.length > 0) {
        sendInput(input);
        setInput("");

        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: "smooth"
        });
      }
    },
    [sendInput]
  );

  // Event listener for the 'ENTER' key
  // If 'SHIFT' key is clicked, do not send the message
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (!event.shiftKey && event.key === "Enter") {
        event.preventDefault();

        pushInput(input);
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [input, pushInput]);

  // Dynamic text area sizing based on the user's input
  useEffect(() => {
    if (textAreaRef && textAreaRef.current) {
      textAreaRef.current.style.height = "0px";
      let scrollHeight = textAreaRef.current.scrollHeight;

      if (scrollHeight > 180) {
        setOverflow(true);
      } else {
        setOverflow(false);
      }

      if (scrollHeight > 180) {
        scrollHeight = 180;
      }

      textAreaRef.current.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, input, overflow]);

  return (
    <Flex
      position={"sticky"}
      w={"full"}
      bottom={0}
      justifyContent={"center"}
      p={8}
      bgColor={colorMode === "dark" ? "background.dark" : "background.light"}
    >
      <InputGroup w={{ base: "full", lg: "50%" }}>
        <Textarea
          ref={textAreaRef}
          resize={"none"}
          placeholder="Message personal chatbot..."
          rows={1}
          autoFocus
          minH={"unset"}
          overflowY={overflow ? "auto" : "hidden"}
          value={input}
          lineHeight={"24px"}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <InputRightElement _hover={{ cursor: "pointer" }} px={8}>
          <Icon as={IoIosSend} boxSize={6} onClick={() => pushInput(input)} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
