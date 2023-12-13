import { GlobalContext } from "@/context/ContextProvider";
import { updateChatRoomTopic } from "@/context/chat/api";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTopicModal({ isOpen, onClose }: Props) {
  const location = useLocation();
  const toast = useToast();
  const { topic, setTopic } = useContext(GlobalContext);
  const id = location.pathname.split("/")[2];

  const [newTopic, setNewTopic] = useState(topic);

  const editTopic = async () => {
    try {
      const data = await updateChatRoomTopic(id, newTopic);

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });

      setTopic(data.topic);
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
        <ModalHeader>Edit topic</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Topic name</FormLabel>
            <Input
              placeholder="Topic name"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter gap={4}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => editTopic()}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
