import { ThemeConfig, extendTheme } from "@chakra-ui/react";
import { colors } from "@/styles/colors";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const theme = extendTheme({
  colors,
  config,
  styles: {
    global: {
      "*": {
        "&::-webkit-scrollbar": {
          w: "2",
          h: "1.5"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "black"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "white",
          borderRadius: "4"
        }
      }
    }
  }
});

export default theme;
