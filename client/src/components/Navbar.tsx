import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { useMeQuery } from '../generated/graphql';

const Navbar = () => {
  const { data, loading } = useMeQuery();

  let body;

  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        /
        <NextLink href="/register">
          <Link ml={2}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = <Button>Logout</Button>;
  }

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
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
