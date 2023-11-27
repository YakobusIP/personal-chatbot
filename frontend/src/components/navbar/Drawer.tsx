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
  VStack
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import RoomNumber from "@/components/RoomNumber";

interface Props {
  rooms: Room[] | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarDrawer({ rooms, isOpen, onClose }: Props) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent bgColor={"navbar.main"} color={"white"}>
        <DrawerHeader>
          <Flex alignItems={"center"} columnGap={4}>
            <Icon
              as={RxHamburgerMenu}
              boxSize={6}
              _hover={{ cursor: "pointer" }}
              onClick={onClose}
            />
            <Flex alignItems={"center"} columnGap={2}>
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
                return <RoomNumber id={room.id} />;
              })}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
