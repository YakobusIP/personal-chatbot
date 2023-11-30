import { Flex, Text, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  topic: string | null;
}

export default function RoomNumber({ id, topic }: Props) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <Flex
      key={id}
      _hover={{
        cursor: "pointer",
        bgColor:
          colorMode === "dark" ? "navbar.dark_hover" : "navbar.light_hover"
      }}
      onClick={() => navigate(`/chat/${id}`)}
      bgColor={colorMode === "dark" ? "navbar.dark" : "navbar.light"}
      p={4}
      rounded={"lg"}
      w={"full"}
    >
      <Text noOfLines={1}>{topic}</Text>
    </Flex>
  );
}
