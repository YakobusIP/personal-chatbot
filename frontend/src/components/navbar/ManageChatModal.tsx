import Room from "@/types/room.type";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { deleteAllChat, deleteChatOnId } from "@/context/chat/api";

interface Props {
  rooms: Room[] | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageChatModal({ rooms, isOpen, onClose }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const deleteAll = async () => {
    try {
      const data = await deleteAllChat();

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });

      navigate("/home");
      onClose();
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

  const deleteOnId = async (id: string) => {
    try {
      const data = await deleteChatOnId(id);

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });

      navigate("/home");
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage chats</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH={"50vh"} overflowY={"auto"}>
          <VStack>
            {rooms && rooms.length > 0 ? (
              rooms.map((room) => {
                return (
                  <HStack
                    w={"full"}
                    p={2}
                    _hover={{
                      transition: "0.1s ease-in",
                      rounded: "lg",
                      bgColor:
                        colorMode === "dark"
                          ? "navbar.dark_hover"
                          : "navbar.light_hover"
                    }}
                  >
                    <Text key={room.id} w={"full"}>
                      {room.topic}
                    </Text>
                    <Button onClick={() => deleteOnId(room.id)}>Delete</Button>
                  </HStack>
                );
              })
            ) : (
              <Text>No available chats</Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter gap={4}>
          {rooms && rooms.length > 0 && (
            <Button w={"full"} onClick={() => deleteAll()}>
              Delete All
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
