import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useColorMode,
  IconButton,
  Container,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

function Chat() {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate
  const username = location.state?.username || 'Anonymous';

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        text: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
        isSelf: true,
      };
      setMessages([...messages, message]);
      // Simulate received message
      setTimeout(() => {
        const receivedMessage = {
          text: `Reply to: ${newMessage}`,
          sender: 'Other User',
          timestamp: new Date().toLocaleTimeString(),
          isSelf: false,
        };
        setMessages((prev) => [...prev, receivedMessage]);
      }, 1000);
      setNewMessage('');
    }
  };

  const handleExitChat = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}
      color={colorMode === 'dark' ? 'white' : 'gray.800'}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        p={4}
        borderBottom="1px"
        borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      >
        <Text fontSize="2xl" fontWeight="bold" color="#4a90e2">
          IITJ-Omegle Chat
        </Text>
        <IconButton
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          color="#4a90e2"
        />
      </Flex>

      {/* Chat Area */}
      <Container maxW="container.md" p={4}>
        <VStack
          spacing={4}
          height="calc(100vh - 200px)"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#4a90e2',
              borderRadius: '24px',
            },
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              alignSelf={message.isSelf ? 'flex-end' : 'flex-start'}
              bg={message.isSelf ? '#4a90e2' : colorMode === 'dark' ? 'gray.700' : 'gray.200'}
              color={message.isSelf ? 'white' : colorMode === 'dark' ? 'white' : 'black'}
              borderRadius="lg"
              px={4}
              py={2}
              maxW="70%"
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Text fontSize="sm" fontWeight="bold">
                {message.sender}
              </Text>
              <Text>{message.text}</Text>
              <Text fontSize="xs" opacity={0.8} textAlign="right">
                {message.timestamp}
              </Text>
            </Box>
          ))}
        </VStack>

        {/* Message Input */}
        <HStack
          as="form"
          onSubmit={handleSendMessage}
          position="fixed"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          width="90%"
          maxW="container.md"
          spacing={2}
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          p={4}
          borderRadius="lg"
          boxShadow="lg"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            size="lg"
            borderColor="#4a90e2"
            _focus={{ borderColor: '#4a90e2' }}
          />
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            bgGradient="linear(to-r, #4a90e2, #357abd)"
          >
            Send
          </Button>
        </HStack>

        {/* Exit Chat Button */}
        <Button
          position="fixed"
          bottom={4}
          right={4}
          colorScheme="red"
          size="lg"
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExitChat}
        >
          Exit Chat
        </Button>
      </Container>
    </Box>
  );
}

export default Chat;
