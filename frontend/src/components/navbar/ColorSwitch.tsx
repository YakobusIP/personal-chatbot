import { Flex, Icon, Switch, useColorMode } from "@chakra-ui/react";
import { FaRegMoon } from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";

export default function ColorSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex alignItems={"center"} columnGap={2}>
      <Icon as={FaRegMoon} boxSize={6} />
      <Switch
        onChange={toggleColorMode}
        size={"md"}
        isChecked={colorMode === "light"}
      />
      <Icon as={IoSunnyOutline} boxSize={6} />
    </Flex>
  );
}
