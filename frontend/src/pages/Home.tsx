import { Button, Flex } from "@chakra-ui/react";
import RootLayout from "../components/RootLayout";

export default function Home() {
  return (
    <RootLayout>
      <Flex
        h={"full"}
        grow={1}
        w={"full"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Button>Create new chat</Button>
      </Flex>
    </RootLayout>
  );
}
