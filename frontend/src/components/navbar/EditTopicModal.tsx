import { ChatTopicContext } from "@/context/ChatTopicContext";
import { axiosClient } from "@/lib/axios";
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
import { AxiosError } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditTopicModal({ isOpen, onClose }: Props) {
  const location = useLocation();
  const toast = useToast();
  const { topic, setTopic } = useContext(ChatTopicContext);
  const id = location.pathname.split("/")[2];

  const [newTopic, setNewTopic] = useState(topic);

  const editTopic = useCallback(async () => {
    try {
      const response = await axiosClient.put("/update-topic", {
        id,
        topic: newTopic
      });

      toast({
        title: response.data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });

      setTopic(response.data.topic);
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
  }, [id, newTopic, onClose, toast, setTopic]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        editTopic();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [editTopic]);

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
              autoFocus
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
