import {
  Flex,
  Heading,
  Icon,
  Image,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect, useCallback, useContext } from "react";
import NavbarDrawer from "@/components/navbar/Drawer";
import Room from "@/types/room.type";
import ColorSwitch from "./ColorSwitch";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { authenticated } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
    if (authenticated) {
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
    }
  }, [toast, authenticated]);

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
      justifyContent={"space-between"}
      zIndex={2}
    >
      <Flex alignItems={"center"} columnGap={4}>
        {authenticated && (
          <Icon
            as={RxHamburgerMenu}
            boxSize={6}
            _hover={{ cursor: "pointer" }}
            onClick={onOpen}
          />
        )}
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
      <ColorSwitch />
      <NavbarDrawer rooms={rooms} isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
