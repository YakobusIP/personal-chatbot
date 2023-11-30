import {
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect, useCallback, useContext } from "react";
import NavbarDrawer from "@/components/navbar/Drawer";
import Room from "@/types/room.type";
import ColorSwitch from "./ColorSwitch";
import { AxiosError } from "axios";
import { ChatTopicContext } from "@/context/ChatTopicContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { topic } = useContext(ChatTopicContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
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
      }
    }
  }, [toast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <Flex
      position={"sticky"}
      w={"full"}
      top={0}
      p={4}
      bgColor={colorMode === "dark" ? "navbar.dark" : "navbar.light"}
      alignItems={"center"}
      zIndex={2}
    >
      <Flex alignItems={"center"} columnGap={4} flex={1}>
        <Icon
          as={RxHamburgerMenu}
          boxSize={6}
          _hover={{ cursor: "pointer" }}
          onClick={onOpen}
        />
        <Flex
          onClick={() => navigate("/home")}
          _hover={{ cursor: "pointer" }}
          alignItems={"center"}
          columnGap={2}
        >
          <Image src="/gpt-black-logo.jpg" boxSize={8} />
          <Heading fontSize={"xl"}>Personal Chatbot</Heading>
        </Flex>
      </Flex>
      {location.pathname.includes("/chat") && (
        <Text mx={"auto"} fontWeight={700} flex={1} textAlign={"center"}>
          {topic}
        </Text>
      )}
      <ColorSwitch />
      <NavbarDrawer rooms={rooms} isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
