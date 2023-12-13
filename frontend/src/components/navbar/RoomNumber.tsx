import { Flex, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  topic: string | null;
}

export default function RoomNumber({ id, topic }: Props) {
  const { colorMode } = useColorMode();

  return (
    <Link to={`/chat/${id}`} style={{ width: "100%" }}>
      <Flex
        key={id}
        _hover={{
          cursor: "pointer",
          bgColor:
            colorMode === "dark" ? "navbar.dark_hover" : "navbar.light_hover"
        }}
        bgColor={colorMode === "dark" ? "navbar.dark" : "navbar.light"}
        p={4}
        rounded={"lg"}
        w={"full"}
      >
        <Text noOfLines={1}>{topic}</Text>
      </Flex>
    </Link>
  );
}
