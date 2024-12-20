import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Main from './projectroutes';  // Import Main instead of App

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#1a1a1a",
      },
    },
  },
});

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Main />
    </ChakraProvider>
  </StrictMode>
);