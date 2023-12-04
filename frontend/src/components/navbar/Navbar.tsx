import {
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  useBreakpointValue
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaEdit } from "react-icons/fa";
import { useState, useEffect, useCallback, useContext } from "react";
import NavbarDrawer from "@/components/navbar/Drawer";
import Room from "@/types/room.type";
import ColorSwitch from "./ColorSwitch";
import { AxiosError } from "axios";
import { ChatTopicContext } from "@/context/ContextProvider";
import EditTopicModal from "@/components/navbar/EditTopicModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLg = useBreakpointValue({ base: false, lg: true });
  const { topic } = useContext(ChatTopicContext);

  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer
  } = useDisclosure();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onClose: onCloseModal
  } = useDisclosure();

  const [rooms, setRoom] = useState<Room[]>();

  const fetchRooms = useCallback(async () => {
    try {
      const response = await axiosClient.get("/chat/room-list");

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
  }, [fetchRooms, topic]);

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
          onClick={onOpenDrawer}
        />
        {isLg && (
          <Flex
            onClick={() => navigate("/home")}
            _hover={{ cursor: "pointer" }}
            alignItems={"center"}
            columnGap={2}
          >
            <Image src="/gpt-black-logo.jpg" boxSize={8} />
            <Heading fontSize={"xl"}>Personal Chatbot</Heading>
          </Flex>
        )}
      </Flex>
      {location.pathname.includes("/chat") && (
        <Flex
          flex={1}
          alignItems={"center"}
          justifyContent={"center"}
          columnGap={2}
        >
          <Text fontWeight={700}>{topic}</Text>
          <Icon
            as={FaEdit}
            _hover={{ cursor: "pointer" }}
            onClick={onOpenModal}
          />
          <EditTopicModal isOpen={isOpenModal} onClose={onCloseModal} />
        </Flex>
      )}
      <ColorSwitch />
      <NavbarDrawer
        rooms={rooms}
        isOpen={isOpenDrawer}
        onClose={onCloseDrawer}
      />
    </Flex>
  );
}
