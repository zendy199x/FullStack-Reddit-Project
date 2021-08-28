import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <Box bg="tan" p={4}>
      <Flex
        maxW={800}
        justifyContent="space-between"
        alignItems="center"
        m="auto"
      >
        <NextLink href="/">
          <Heading>Reddit</Heading>
        </NextLink>
        <Box>
          <NextLink href="/login">
            <Link m={2}>Login</Link>
          </NextLink>
          /
          <NextLink href="/register">
            <Link m={2}>Register</Link>
          </NextLink>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
