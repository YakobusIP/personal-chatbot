import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
}

export default function RoomNumber({ id }: Props) {
  const navigate = useNavigate();

  return (
    <Flex
      key={id}
      _hover={{ cursor: "pointer", bgColor: "navbar.light" }}
      onClick={() => navigate(`/chat/${id}`)}
      bgColor={"navbar.main"}
      p={4}
      rounded={"lg"}
    >
      <Text>{id}</Text>
    </Flex>
  );
}
