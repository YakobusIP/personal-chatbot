import {
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  Text,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import { AxiosError } from "axios";
import { createNewChatRoom } from "@/context/chat/api";
import { useContext } from "react";
import { GlobalContext } from "@/context/ContextProvider";
import RoomNumber from "@/components/navbar/RoomNumber";

export default function Home() {
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { rooms } = useContext(GlobalContext);

  const createNewRoom = async () => {
    try {
      const data = await createNewChatRoom();

      navigate(`/chat/${data.data.id}`);

      toast({
        title: "Success",
        description: data.message,
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
        p={8}
      >
        <Image
          src={
            colorMode === "dark"
              ? "/gpt-white-transparent.png"
              : "/gpt-black-transparent.png"
          }
          boxSize={24}
        />
        <Heading textAlign={"center"}>How can I help you today?</Heading>
        <Button onClick={() => createNewRoom()}>Create new chat</Button>
        <Text fontWeight={700} mt={8}>
          Your recent chats
        </Text>
        <HStack gap={4}>
          {rooms &&
            rooms.slice(0, 5).map((room) => {
              return (
                <RoomNumber key={room.id} id={room.id} topic={room.topic} />
              );
            })}
        </HStack>
      </Flex>
    </RootLayout>
  );
}
