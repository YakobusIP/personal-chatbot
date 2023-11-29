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
  Menu,
  MenuButton,
  Avatar,
  Text,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { RxHamburgerMenu } from "react-icons/rx";
import RoomNumber from "@/components/RoomNumber";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "@/lib/axios";

interface Props {
  rooms: Room[] | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function NavbarDrawer({ rooms, isOpen, onClose }: Props) {
  const { colorMode } = useColorMode();
  const { setAuthenticated, username } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setAuthenticated(false);
    delete axiosClient.defaults.headers.common["Authorization"];
  };

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
        <DrawerFooter w={"full"}>
          <Menu>
            <MenuButton
              w={"full"}
              _hover={{
                bgColor:
                  colorMode === "dark"
                    ? "navbar.dark_hover"
                    : "navbar.light_hover"
              }}
              p={2}
              rounded={"lg"}
            >
              <Flex columnGap={4} alignItems={"center"}>
                <Avatar name={username} size={"md"} />
                <Text fontWeight={"bold"}>{username}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
