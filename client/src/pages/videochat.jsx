import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

function VideoChat() {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
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

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}
      color={colorMode === 'dark' ? 'white' : 'gray.800'}
      p={4}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="#4a90e2">
          IITJ-Omegle Video Chat
        </Text>
        <IconButton
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          color="#4a90e2"
        />
      </Flex>

      <Flex>
        {/* Video Section */}
        <Box
          width="30%"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          border="2px"
          borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
          borderRadius="lg"
          p={2}
        >
          <Box
            flex="1"
            bg="black"
            color="white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
            border="2px"
            borderColor="gray.500"
            borderRadius="md"
          >
            Your Video
          </Box>
          <Box
            flex="1"
            bg="black"
            color="white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="2px"
            borderColor="gray.500"
            borderRadius="md"
          >
            Other User's Video
          </Box>

          {/* Buttons */}
          <HStack
            mt={4}
            justify="center"
            spacing={2}
            
            p={2}
          >
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => alert('Skipping User...')}
            >
              Skip User
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => navigate('/')}
            >
              End Video Chat
            </Button>
          </HStack>
        </Box>

        {/* Chat Section */}
        <Box width="70%" ml={4}>
          <VStack
            spacing={4}
            height="calc(100vh - 200px)"
            overflowY="auto"
            border="2px"
            borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
            borderRadius="lg"
            p={4}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
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
            spacing={2}
            mt={4}
            p={4}
            border="2px"
            borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.300'}
            borderRadius="lg"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              size="lg"
              borderColor="#4a90e2"
              _focus={{ borderColor: '#4a90e2' }}
            />
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              bgGradient="linear(to-r, #4a90e2, #357abd)"
            >
              Send
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default VideoChat;
