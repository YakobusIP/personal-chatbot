import { VStack } from "@chakra-ui/react";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <VStack w={"full"} bgColor={"main"} minH={"100vh"} color={"white"}>
      <Navbar />
      {children}
    </VStack>
  );
}
