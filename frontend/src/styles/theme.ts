import { extendTheme } from "@chakra-ui/react";

export const colors = {
  navbar: {
    main: "#2C3E50",
    light: "#597a9c"
  },
  main: "#1D2731"
};

const theme = extendTheme({
  colors,
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
