import { validate, Validator, CustomMessages } from './validator.js';

export function conditional<T>(
  value: T,
  conditions: Array<{
    condition: (value: T) => boolean;
    rules: (validator: Validator<T>) => Validator<T>;
  }>,
  customMessages?: CustomMessages
): { valid: boolean; errors: string[]; value: T } {
  const validator = validate(value, customMessages);
  
  for (const { condition, rules } of conditions) {
    if (condition(value)) {
      rules(validator);
    }
  }
  
  return {
    valid: validator.isValid(),
    errors: validator.getErrors(),
    value: validator.getValue()
  };
}

export function createConditionalValidator<T>(value: T, customMessages?: CustomMessages) {
  const conditions: Array<{
    condition: (value: T) => boolean;
    rules: (validator: Validator<T>) => Validator<T>;
  }> = [];
  
  return {
    if: (condition: (value: T) => boolean, rules: (validator: Validator<T>) => Validator<T>) => {
      conditions.push({ condition, rules });
      return createConditionalValidator(value, customMessages);
    },
    validate: () => conditional(value, conditions, customMessages)
  };
}