import {
  Flex,
  Heading,
  Icon,
  Image,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect, useCallback } from "react";
import NavbarDrawer from "@/components/navbar/Drawer";
import Room from "@/types/room.type";

export default function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
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
      bgColor={"navbar.main"}
      alignItems={"center"}
      zIndex={2}
      columnGap={4}
    >
      <Icon
        as={RxHamburgerMenu}
        boxSize={6}
        _hover={{ cursor: "pointer" }}
        onClick={onOpen}
      />
      <Flex
        onClick={() => navigate("/")}
        _hover={{ cursor: "pointer" }}
        alignItems={"center"}
        columnGap={2}
      >
        <Image src="/gpt-black-logo.jpg" boxSize={8} />
        <Heading fontSize={"xl"}>Personal Chatbot</Heading>
      </Flex>
      <NavbarDrawer rooms={rooms} isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
