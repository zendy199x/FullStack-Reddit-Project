import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import NextLink from 'next/link';
import React from 'react';
import { InputField, Wrapper } from '../components';
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from '../generated/graphql';
import { useCheckAuth } from '../utils/useCheckAuth';

const ForgotPassword = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues = { email: '' };

  const [forgotPassword, { data, loading }] = useForgotPasswordMutation();

  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
  };

  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper>
          <Formik
            initialValues={initialValues}
            onSubmit={onForgotPasswordSubmit}
          >
            {({ isSubmitting }) =>
              !loading && data ? (
                <Box>Please check your inbox</Box>
              ) : (
                <Form>
                  <InputField
                    name="email"
                    label="Email"
                    placeholder="Email"
                    type="email"
                  />
                  <Flex mt={2}>
                    <NextLink href="/login">
                      <Link ml="auto">Back to Login</Link>
                    </NextLink>
                  </Flex>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Send Reset Password Email
                  </Button>
                </Form>
              )
            }
          </Formik>
        </Wrapper>
      )}
    </>
  );
};

export default ForgotPassword;
