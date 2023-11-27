import { Flex, Text, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
}

export default function RoomNumber({ id }: Props) {
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
    >
      <Text noOfLines={1}>{id}</Text>
    </Flex>
  );
}
