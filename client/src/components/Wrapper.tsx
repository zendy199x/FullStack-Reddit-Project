import { Box } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

type WrapperSize = 'regular' | 'small';

interface WrapperProps {
  children: ReactNode;
  size?: WrapperSize;
}

export const Wrapper = ({ children, size = 'regular' }: WrapperProps) => {
  return (
    <Box
      maxW={size === 'regular' ? '800px' : '600px'}
      w="100%"
      mt="8"
      mx="auto"
    >
      {children}
    </Box>
  );
};
