import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  return (
    <Box maxW="400px" w="100%" mt="8" mx="auto">
      {children}
    </Box>
  );
};
