import { Box, Button, FormControl } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldError';

const Login = () => {
  const route = useRouter();

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
      route.push('/');
    }
  };

  console.log(`Login data`, JSON.stringify(data));
  console.log(`Login error`, error);

  return (
    <Wrapper>
      {error && <p>Failed to login. Internal server error.</p>}
      <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
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

export default Login;
