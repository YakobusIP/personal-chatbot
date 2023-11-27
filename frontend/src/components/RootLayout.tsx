import { VStack, useColorMode } from "@chakra-ui/react";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { colorMode } = useColorMode();
  return (
    <VStack
      w={"full"}
      bgColor={colorMode === "dark" ? "background.dark" : "background.light"}
      minH={"100vh"}
      color={colorMode === "dark" ? "white" : "black"}
    >
      <Navbar />
      {children}
    </VStack>
  );
}
