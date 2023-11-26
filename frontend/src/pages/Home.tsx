import {
  Button,
  Flex,
  Heading,
  useToast,
  Spinner,
  Text
} from "@chakra-ui/react";
import RootLayout from "../components/RootLayout";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  topic: string | null;
}

export default function Home() {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:4000/room-list");

      setRoom(response.data.data);
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 2000,
        position: "top"
      });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createNewRoom = async () => {
    try {
      const response = await axios.post("http://localhost:4000/new-chat");

      navigate(`/chat/${response.data.data.id}`);

      toast({
        title: response.data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        duration: 2000,
        position: "top"
      });
    }
  };

  return (
    <RootLayout>
      <Flex
        h={"full"}
        grow={1}
        w={"full"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        rowGap={4}
      >
        <Heading>List of available chats</Heading>
        {loading ? (
          <Spinner />
        ) : (
          rooms &&
          rooms.map((room) => {
            return (
              <Flex
                key={room.id}
                _hover={{ cursor: "pointer" }}
                onClick={() => navigate(`/chat/${room.id}`)}
                bgColor={"navbar"}
                p={4}
                rounded={"lg"}
              >
                <Text>{room.id}</Text>
              </Flex>
            );
          })
        )}
        <Button onClick={() => createNewRoom()}>Create new chat</Button>
      </Flex>
    </RootLayout>
  );
}
