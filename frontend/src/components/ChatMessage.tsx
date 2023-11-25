import { Flex, Heading, Text } from "@chakra-ui/react";

export default function ChatMessage() {
  return (
    <Flex
      direction={"column"}
      position={"sticky"}
      w={"60%"}
      bottom={0}
      justifyContent={"center"}
      p={8}
      rowGap={2}
    >
      <Heading fontSize={20}>Me</Heading>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras gravida
        vel mi non tempus. Nunc aliquet nibh eget augue congue pharetra. Aenean
        sagittis elit ac lorem commodo, eu venenatis felis tristique. Maecenas
        at nisi eget orci hendrerit dapibus ac ut erat. Etiam scelerisque, massa
        vel gravida rhoncus, ante arcu sodales sem, vel maximus leo odio at
        nisl. Mauris quis justo ornare, condimentum odio in, aliquet ipsum.
        Etiam eget feugiat quam.
      </Text>
    </Flex>
  );
}
