import { Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import { AxiosError } from "axios";

export default function Home() {
  const toast = useToast();
  const navigate = useNavigate();

  const createNewRoom = async () => {
    try {
      const response = await axiosClient.post("/new-chat");

      navigate(`/chat/${response.data.data.id}`);

      toast({
        title: response.data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });
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
    <RootLayout>
      <Flex
        h={"full"}
        grow={1}
        w={"full"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        rowGap={4}
      >
        <Heading>How can I help you today?</Heading>
        <Button onClick={() => createNewRoom()}>Create new chat</Button>
      </Flex>
    </RootLayout>
  );
}
