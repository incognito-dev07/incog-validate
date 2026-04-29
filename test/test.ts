import { validate, rules, schema } from '../index.js';

// TypeScript type checking test
const emailResult: boolean = rules.email('test@example.com');
const phoneResult: boolean = rules.phone('+1234567890');

const validator = validate('test@example.com')
  .required()
  .email()
  .minLength(5);

const isValid: boolean = validator.isValid();
const errors: string[] = validator.getErrors();

const userSchema = schema({
  name: { type: 'string', required: true, min: 2, max: 50 },
  email: { type: 'email', required: true }
});

const result = userSchema.validate({ name: 'John', email: 'john@example.com' });
console.log('TypeScript test passed!');