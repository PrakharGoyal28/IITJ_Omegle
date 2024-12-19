import { Box, Button, FormControl, FormLabel, Input, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

function Authentication() {
  console.log("Authentication component rendered");  // Debugging line

  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
  };

  return (
    <Box 
      bgGradient="linear(to-b, #1a1a1a, #2d2d2d)" 
      minH="100vh" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      padding={4}
    >
      <Heading
        as={motion.h1}
        color="#4a90e2"
        fontSize={{ base: "4xl", md: "6xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={8}
        whileHover={{ scale: 1.1 }}
        _hover={{ cursor: "pointer" }}
      >
        IITJ-Omegle
      </Heading>

      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        bg="rgba(0, 0, 0, 0.7)" 
        borderRadius="md" 
        p={6}
        width="100%"
        maxWidth="400px"
      >
        <FormControl mb={4}>
          <FormLabel htmlFor="username" color="white">Enter your username</FormLabel>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="lg"
            borderColor="#4a90e2"
            bg="rgba(255, 255, 255, 0.1)"
            color="white"
            _placeholder={{ color: "white" }}
            _focus={{ borderColor: "#4a90e2" }}
            placeholder="Username"
          />
        </FormControl>

        <Button
          type="submit"
          as={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          size="lg"
          colorScheme="blue"
          bgGradient="linear(to-r, #4a90e2, #357abd)"
          color="white"
          px={8}
          py={6}
          fontSize="xl"
          _hover={{
            bgGradient: "linear(to-r, #357abd, #4a90e2)",
          }}
        >
          Start Chatting
        </Button>
      </Box>
    </Box>
  );
}

export default Authentication;
