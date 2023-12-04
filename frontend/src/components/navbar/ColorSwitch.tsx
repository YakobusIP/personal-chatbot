import {
  Flex,
  Icon,
  Switch,
  useBreakpointValue,
  useColorMode
} from "@chakra-ui/react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

export default function ColorSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLg = useBreakpointValue({ base: false, lg: true });
  return (
    <Flex
      alignItems={"center"}
      flex={1}
      justifyContent={"flex-end"}
      columnGap={2}
    >
      {isLg ? (
        <>
          <Icon as={IoMoonOutline} boxSize={6} />
          <Switch
            onChange={toggleColorMode}
            size={"md"}
            isChecked={colorMode === "light"}
          />
          <Icon as={IoSunnyOutline} boxSize={6} />
        </>
      ) : (
        <>
          {colorMode === "dark" ? (
            <Icon as={IoMoonOutline} onClick={toggleColorMode} boxSize={6} />
          ) : (
            <Icon as={IoSunnyOutline} onClick={toggleColorMode} boxSize={6} />
          )}
        </>
      )}
    </Flex>
  );
}
