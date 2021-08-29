import { Box, Button, Flex, Heading, Link, useToast } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from '../generated/graphql';

export const Navbar = () => {
  const toast = useToast();

  const { data, loading: useMeQueryLoading } = useMeQuery();
  const [logoutUser, { loading: useLogoutMutationLoading }] =
    useLogoutMutation();

  const handleLogoutUser = async () => {
    await logoutUser({
      update(cache, { data }) {
        if (data?.logout) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: null },
          });
        }
      },
    });

    toast({
      title: 'Logout successfully !',
      description: null,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  let body;

  if (useMeQueryLoading) {
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
    body = (
      <Button onClick={handleLogoutUser} isLoading={useLogoutMutationLoading}>
        Logout
      </Button>
    );
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
