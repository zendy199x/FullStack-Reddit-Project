import { Box, Button, Flex, Spinner, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField, Wrapper } from '../components';
import {
  MeDocument,
  MeQuery,
  RegisterInput,
  useRegisterMutation,
} from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldError';
import { useCheckAuth } from '../utils/useCheckAuth';

const Register = () => {
  const router = useRouter();

  const toast = useToast();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: RegisterInput = {
    username: '',
    email: '',
    password: '',
  };

  const [registerUser, { data, loading: _registerUserLoading, error }] =
    useRegisterMutation();

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: {
        registerInput: values,
      },
      update(cache, { data }) {
        if (data?.register?.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.register.user },
          });
        }
      },
    });

    if (response.data?.register?.errors) {
      setErrors(mapFieldErrors(response.data.register.errors));
    } else if (response.data?.register?.user) {
      // Register successfully
      toast({
        title: 'Register successfully !',
        description: `Welcome to ${response.data?.register?.user.username}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/');
    }
  };

  console.log(`Register data`, JSON.stringify(data));
  console.log(`Register error`, error);

  return (
    <>
      {authLoading ||
        (!authLoading && authData?.me ? (
          <Flex justifyContent="center" alignItems="center" minH="100vh">
            <Spinner />
          </Flex>
        ) : (
          <Wrapper size="small">
            {error && <p>Failed to register. Internal server error.</p>}
            <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
              {({ isSubmitting }) => (
                <Form>
                  <InputField
                    name="username"
                    label="Username"
                    placeholder="Username"
                    type="text"
                  />
                  <Box>
                    <InputField
                      name="email"
                      label="Email"
                      placeholder="Email"
                      type="email"
                    />
                  </Box>
                  <Box>
                    <InputField
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                    />
                  </Box>
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

export default Register;
