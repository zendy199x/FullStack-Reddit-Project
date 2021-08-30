import { Box, Button, Flex, Link, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField, Wrapper } from '../components';
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldError';
import { useCheckAuth } from '../utils/useCheckAuth';

const Login = () => {
  const router = useRouter();

  const toast = useToast();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: LoginInput = {
    usernameOrEmail: '',
    password: '',
  };

  const [loginUser, { data, loading: _loginUserLoading, error }] =
    useLoginMutation();

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        console.log(`DATA LOGIN`, data);

        // const meData = cache.readQuery({
        //   query: MeDocument,
        // });
        // console.log(`MEDATA`, meData);

        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });

    if (response.data?.login?.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data?.login?.user) {
      // Register successfully
      toast({
        title: 'Login successfully !',
        description: `Welcome to ${response.data?.login?.user.username}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/');
    }
  };

  console.log(`Login data`, JSON.stringify(data));
  console.log(`Login error`, error);

  return (
    <>
      {authLoading ||
        (!authLoading && authData?.me ? (
          <Flex justifyContent="center" alignItems="center" minH="100vh">
            <Spinner />
          </Flex>
        ) : (
          <Wrapper>
            {error && <p>Failed to login. Internal server error.</p>}
            <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="usernameOrEmail"
                    label="Username or Email"
                    placeholder="Username or Email"
                    type="text"
                  />
                  <Box>
                    <InputField
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                    />
                  </Box>

                  <Flex mt={2}>
                    <NextLink href="/forgot-password">
                      <Link ml="auto">Forgot Password</Link>
                    </NextLink>
                  </Flex>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    mt={4}
                    isLoading={isSubmitting}
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
          </Wrapper>
        ))}
    </>
  );
};

export default Login;
