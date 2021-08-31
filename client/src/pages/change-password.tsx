import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField, Wrapper } from '../components';
import {
  ChangePasswordInput,
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '../generated/graphql';
import { mapFieldErrors } from '../helpers/mapFieldError';
import { useCheckAuth } from '../utils/useCheckAuth';

const ChangePassword = () => {
  const router = useRouter();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const { query } = useRouter();

  const initialValues: ChangePasswordInput = { newPassword: '' };

  const [changePassword] = useChangePasswordMutation();

  const [tokenError, setTokenError] = useState('');

  const onChangePasswordSubmit = async (
    values: ChangePasswordInput,
    { setErrors }: FormikHelpers<ChangePasswordInput>
  ) => {
    if (query.userId && query.token) {
      const response = await changePassword({
        variables: {
          userId: query.userId as string,
          token: query.token as string,
          changePasswordInput: values,
        },
        update(cache, { data }) {
          if (data?.changePassword.success) {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: { me: data.changePassword.user },
            });
          }
        },
      });

      if (response.data?.changePassword.errors) {
        const fieldErrors = mapFieldErrors(response.data.changePassword.errors);
        if ('token' in fieldErrors) {
          setTokenError(fieldErrors.token);
        }
        setErrors(fieldErrors);
      } else if (response.data?.changePassword.user) {
        router.push('/');
      }
    }
  };

  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : !query.token || !query.userId ? (
        <Wrapper size="small">
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Invalid password change request</AlertTitle>
          </Alert>
          <Flex mt={2}>
            <NextLink href="/login">
              <Link ml="auto">Back to Login</Link>
            </NextLink>
          </Flex>
        </Wrapper>
      ) : (
        <Wrapper>
          <Formik
            initialValues={initialValues}
            onSubmit={onChangePasswordSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="newPassword"
                  label="New password"
                  placeholder="New password"
                  type="password"
                />
                {tokenError && (
                  <Flex>
                    <Box color="red" mr={2}>
                      {tokenError}
                    </Box>
                    <NextLink href="/forgot-password">
                      <Link>Go back to Forgot Password</Link>
                    </NextLink>
                  </Flex>
                )}
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Change Password
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  );
};

export default ChangePassword;
