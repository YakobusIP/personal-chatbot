import {
  Button,
  Flex,
  Heading,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text
} from "@chakra-ui/react";
import { axiosClient } from "@/lib/axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import RootLayout from "@/components/RootLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";

interface FormValues {
  username: string;
  password: string;
}

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const { setAuthenticated, setUsername } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    mode: "onSubmit"
  });

  const [loading, setLoading] = useState(false);

  const login: SubmitHandler<FormValues> = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/login", data);

      toast({
        title: response.data.message,
        status: "success",
        duration: 2000,
        position: "top"
      });

      localStorage.setItem("token", response.data.token);
      axiosClient.defaults.headers.common = {
        Authorization: `Bearer ${response.data.token}`
      };
      navigate("/home");
      setAuthenticated(true);
      setUsername(response.data.username);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast({
          title: "Error",
          description: error.response.data.message,
          status: "error",
          duration: 2000,
          position: "top"
        });
      } else {
        toast({
          title: "Error",
          description: "Fatal error",
          status: "error",
          duration: 2000,
          position: "top"
        });
      }
    }
    setLoading(false);
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
        <VStack as={"form"} w={"25%"} gap={4} onSubmit={handleSubmit(login)}>
          <Heading borderBottom={"1px"} pb={4} w={"full"} textAlign={"center"}>
            Personal Chatbot
          </Heading>
          <Text fontSize={20}>Login to continue</Text>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Username"
              type="text"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            isDisabled={!isValid}
            w={"full"}
            type="submit"
            isLoading={loading}
            loadingText="Loading..."
          >
            Login
          </Button>
        </VStack>
      </Flex>
    </RootLayout>
  );
}
