import { Button, Flex, Heading, useToast, Spinner } from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import RoomNumber from "@/components/RoomNumber";
import Room from "@/types/room.type";
import { AxiosError } from "axios";

export default function Home() {
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/room-list");

      setRoom(response.data.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: "Error",
          description: error.response.data.message,
          status: "error",
          duration: 2000,
          position: "top"
        });
      } else {
        toast({
          title: "Error",
          description: "Fatal error",
          status: "error",
          duration: 2000,
          position: "top"
        });
      }
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const createNewRoom = async () => {
    try {
      const response = await axiosClient.post("/new-chat");

      navigate(`/chat/${response.data.data.id}`);

      toast({
        title: response.data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: "Error",
          description: error.response.data.message,
          status: "error",
          duration: 2000,
          position: "top"
        });
      } else {
        toast({
          title: "Error",
          description: "Fatal error",
          status: "error",
          duration: 2000,
          position: "top"
        });
      }
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
            return <RoomNumber id={room.id} />;
          })
        )}
        <Button onClick={() => createNewRoom()}>Create new chat</Button>
      </Flex>
    </RootLayout>
  );
}
