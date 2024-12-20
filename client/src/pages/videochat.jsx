import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useColorMode,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { io } from "socket.io-client";

function VideoChat() {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "Anonymous";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [partnerStream, setPartnerStream] = useState(null);
  const [partnerId, setPartnerId] = useState(null);

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
    });

    socketRef.current.on("paired", ({ partnerId }) => {
      console.log("Paired with:", partnerId);
      setPartnerId(partnerId);
    });

    socketRef.current.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("offer", async ({ sdp, from }) => {
      console.log("Received offer from:", from);
      if (!peerConnectionRef.current) return;

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socketRef.current.emit("answer", {
        target: from,
        sdp: peerConnectionRef.current.localDescription,
      });
    });

    socketRef.current.on("answer", async ({ sdp }) => {
      console.log("Received answer");
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
    });

    socketRef.current.on("candidate", async ({ candidate }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    socketRef.current.on("partner-disconnected", () => {
      console.log("Partner disconnected");
      // Refresh the window as requested
      window.location.reload();
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (partnerStream) partnerStream.getTracks().forEach((track) => track.stop());
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const enableWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        peerConnectionRef.current.ontrack = (event) => {
          const remoteStream = event.streams[0];
          setPartnerStream(remoteStream);
          if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = remoteStream;
          }
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate && partnerId) {
            socketRef.current.emit("candidate", {
              target: partnerId,
              candidate: event.candidate,
            });
          }
        };
      } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Failed to access webcam. Please grant permissions and try again.");
      }
    };

    enableWebcam();
  }, []);

  // After we have both a local stream and partnerId, attempt to create and send an offer
  useEffect(() => {
    const tryCreateOffer = async () => {
      if (partnerId && peerConnectionRef.current && localStream) {
        // Only create an offer if no localDescription is set (to avoid duplicates)
        if (!peerConnectionRef.current.localDescription) {
          console.log("Creating offer...");
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          socketRef.current.emit("offer", {
            target: partnerId,
            sdp: offer,
          });
        }
      }
    };
    tryCreateOffer();
  }, [partnerId, localStream]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && partnerId) {
      const message = {
        text: newMessage,
        sender: username,
        timestamp: new Date().toLocaleTimeString(),
      };
      socketRef.current.emit("send-message", { message, target: partnerId });
      setMessages((prev) => [...prev, { ...message, isSelf: true }]);
      setNewMessage("");
    }
  };

  const handleSkipUser = () => {
    // This needs a server-side handler for "skip-user"
    socketRef.current.emit("skip-user");
    setPartnerId(null);
    setPartnerStream(null);
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    window.location.reload(); // Reload to reset
  };

  return (
    <Box
      minH="100vh"
      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
      color={colorMode === "dark" ? "white" : "gray.800"}
      p={4}
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="#4a90e2">
          IITJ-Omegle Video Chat
        </Text>
        <IconButton
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
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
          borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
          borderRadius="lg"
          p={2}
        >
          <Box
            flex="1"
            bg="black"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
            borderRadius="md"
            overflow="hidden"
          >
            <video
              autoPlay
              playsInline
              muted
              ref={localVideoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Box
            flex="1"
            bg="black"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
            overflow="hidden"
          >
            <video
              autoPlay
              playsInline
              ref={partnerVideoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <HStack mt={4} justify="center" spacing={2}>
            <Button colorScheme="blue" size="sm" onClick={handleSkipUser}>
              Skip User
            </Button>
            <Button colorScheme="red" size="sm" onClick={() => navigate("/")}>
              End Chat
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
            borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
            borderRadius="lg"
            p={4}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                alignSelf={message.isSelf ? "flex-end" : "flex-start"}
                bg={
                  message.isSelf
                    ? "#4a90e2"
                    : colorMode === "dark"
                    ? "gray.700"
                    : "gray.200"
                }
                color={message.isSelf ? "white" : "black"}
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

          <HStack
            as="form"
            onSubmit={handleSendMessage}
            spacing={2}
            mt={4}
            p={4}
            border="2px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
            borderRadius="lg"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              size="lg"
              borderColor="#4a90e2"
              disabled={!partnerId}
            />
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              bgGradient="linear(to-r, #4a90e2, #357abd)"
              disabled={!partnerId}
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
