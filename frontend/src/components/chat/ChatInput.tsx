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
  const [rows, setRows] = useState(1);
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

  const onTextValueChange = () => {
    if (textAreaRef.current) {
      const text = textAreaRef.current.value;
      const lineLength = 90;

      let rows = Math.ceil(text.length / lineLength);

      if (rows === 0) {
        rows = 1;
      } else if (rows > 5) {
        rows = 5;
      }

      setRows(rows);
    }
  };

  return (
    <Flex
      position={"sticky"}
      w={"full"}
      bottom={0}
      justifyContent={"center"}
      p={8}
      bgColor={colorMode === "dark" ? "background.dark" : "background.light"}
    >
      <InputGroup w={"50%"}>
        <Textarea
          ref={textAreaRef}
          resize={"none"}
          placeholder="Message personal chatbot..."
          rows={rows}
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onTextValueChange();
          }}
        />
        <InputRightElement _hover={{ cursor: "pointer" }} px={8}>
          <Icon as={IoIosSend} boxSize={6} onClick={() => pushInput(input)} />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
}
