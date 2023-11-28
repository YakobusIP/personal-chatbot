import { Flex, Icon, Switch, useColorMode } from "@chakra-ui/react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

export default function ColorSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex alignItems={"center"} columnGap={2}>
      <Icon as={IoMoonOutline} boxSize={6} />
      <Switch
        onChange={toggleColorMode}
        size={"md"}
        isChecked={colorMode === "light"}
      />
      <Icon as={IoSunnyOutline} boxSize={6} />
    </Flex>
  );
}
