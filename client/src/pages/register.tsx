import { Box, Button, FormControl } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { RegisterInput, useRegisterMutation } from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldError';

const Register = () => {
  const route = useRouter();

  const initialValues: RegisterInput = {
    username: '',
    email: '',
    password: '',
  };

  const [registerUser, { data, error }] = useRegisterMutation();

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const response = await registerUser({
      variables: {
        registerInput: values,
      },
    });

    if (response.data?.register?.errors) {
      setErrors(mapFieldErrors(response.data.register.errors));
    } else if (response.data?.register?.user) {
      // Register successfully
      route.push('/');
    }
  };

  console.log(`register data`, data);
  console.log(`register error`, error);

  return (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
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
                  type="text"
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
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
