import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes from react-router-dom
import { Box, Button, Heading, ScaleFade } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

//import Authentication from './pages/Authentication.jsx';  // Import the Authentication component

function App() {
  const navigate = useNavigate();  // Use this hook for navigation

  const handleRedirect = () => {
    navigate("/Authentication");  // Redirects to the authentication page
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
      <ScaleFade in={true} initialScale={0.9}>
        <Heading
          as={motion.h1}
          color="#4a90e2"
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="bold"
          textAlign="center"
          mb={8}
          animation="bounce 1s infinite"
          whileHover={{ scale: 1.1 }}
          _hover={{ cursor: "pointer" }}
        >
          IITJ-Omegle
        </Heading>
      </ScaleFade>

      <Button
        as={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        size="lg"
        colorScheme="blue"
        bgGradient="linear(to-r, #4a90e2, #357abd)"
        color="white"
        px={8}
        py={6}
        onClick={handleRedirect}
        fontSize="xl"
        _hover={{
          bgGradient: "linear(to-r, #357abd, #4a90e2)",
        }}
      >
        Get Started
      </Button>
    </Box>
  );
}

export default App;
