import { validate, Validator, CustomMessages } from './validator.js';

export async function validateAsync<T>(
  value: T,
  rules: (validator: Validator<T>) => Validator<T>,
  customMessages?: CustomMessages
): Promise<{ valid: boolean; errors: string[]; value: T }> {
  const validator = validate(value, customMessages);
  rules(validator);
  const valid = await validator.isValidAsync();
  return {
    valid,
    errors: validator.getErrors(),
    value: validator.getValue()
  };
}

export function createAsyncValidator<T>(value: T, customMessages?: CustomMessages) {
  const validator = validate(value, customMessages);
  return {
    addRule: (ruleFn: (validator: Validator<T>) => Validator<T>) => {
      ruleFn(validator);
      return createAsyncValidator(value, customMessages);
    },
    addAsyncRule: (rule: (value: T) => Promise<boolean>, message: string) => {
      validator.customAsync(rule, message);
      return createAsyncValidator(value, customMessages);
    },
    validate: async () => ({
      valid: await validator.isValidAsync(),
      errors: validator.getErrors(),
      value: validator.getValue()
    })
  };
}