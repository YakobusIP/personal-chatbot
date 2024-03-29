import Room from "@/types/room.type";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Flex,
  Icon,
  Image,
  Heading,
  DrawerBody,
  VStack,
  useColorMode,
  DrawerFooter,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import RoomNumber from "@/components/navbar/RoomNumber";
import { useNavigate } from "react-router-dom";
import ManageChatModal from "./ManageChatModal";

interface Props {
  rooms: Room[] | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarDrawer({ rooms, isOpen, onClose }: Props) {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const {
    isOpen: isOpenManage,
    onClose: onCloseManage,
    onOpen: onOpenManage
  } = useDisclosure();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent
        bgColor={colorMode === "dark" ? "navbar.dark" : "navbar.light"}
      >
        <DrawerHeader>
          <Flex alignItems={"center"} columnGap={4}>
            <Icon
              as={RxHamburgerMenu}
              boxSize={6}
              _hover={{ cursor: "pointer" }}
              onClick={onClose}
            />
            <Flex
              alignItems={"center"}
              columnGap={2}
              onClick={() => navigate("/home")}
            >
              <Image src="/gpt-black-logo.jpg" boxSize={8} />
              <Heading fontSize={"xl"}>Personal Chatbot</Heading>
            </Flex>
          </Flex>
        </DrawerHeader>
        <DrawerBody>
          <VStack rowGap={4}>
            <Heading fontSize={"2xl"}>List of chats</Heading>
            {rooms &&
              rooms.map((room) => {
                return <RoomNumber id={room.id} topic={room.topic} />;
              })}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button w={"full"} onClick={onOpenManage}>
            Manage Chats
          </Button>
          <ManageChatModal
            isOpen={isOpenManage}
            onClose={onCloseManage}
            rooms={rooms}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
