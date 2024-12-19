import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#1a1a1a", // Dark background as per your theme
      },
    },
  },
});

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </StrictMode>
);
