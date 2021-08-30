import { FieldError } from './../generated/graphql';

// [{field: 'username', message: 'error'}] => {username: 'error'}

export const mapFieldErrors = (
  errors: FieldError[]
): { [key: string]: string } => {
  return errors.reduce(
    (accumulatedErrorObject, error) => ({
      ...accumulatedErrorObject,
      [error.field]: error.message,
    }),
    {}
  );
};
