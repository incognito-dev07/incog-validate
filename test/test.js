import { 
  validate, 
  rules, 
  schema, 
  validateAsync,
  conditional,
  nestedSchema,
  batchValidate,
  batchResultSummary
} from '../dist/index.js';

console.log('\nTesting zelvar-validate\n');

// Test 1: Basic rules
console.log('Email validation:');
console.log('  test@example.com:', rules.email('test@example.com') ? '✓' : '✗');
console.log('  invalid:', rules.email('invalid') ? '✓' : '✗');

// Test 2: Phone validation
console.log('\nPhone validation:');
console.log('  +1234567890:', rules.phone('+1234567890') ? '✓' : '✗');
console.log('  abc:', rules.phone('abc') ? '✓' : '✗');

// Test 3: URL validation
console.log('\nURL validation:');
console.log('  https://google.com:', rules.url('https://google.com') ? '✓' : '✗');
console.log('  not-a-url:', rules.url('not-a-url') ? '✓' : '✗');

// Test 4: Chainable validator
console.log('\nChainable validator:');
const result = validate('test@example.com')
  .email();

console.log('  Valid:', result.isValid());
console.log('  Errors:', result.getErrors());

// Test 5: Strong password
console.log('\nStrong password:');
console.log('  Pass123!:', rules.strongPassword('Pass123!') ? '✓' : '✗');
console.log('  weak:', rules.strongPassword('weak') ? '✓' : '✗');

// Test 6: Schema validation
console.log('\nSchema validation:');
const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

const invalidUser = { name: 'John', email: 'not-an-email' };
const invalidResult = userSchema.validate(invalidUser);
console.log('  Errors:', invalidResult.errors);

// Test 7: Custom error messages
console.log('\nCustom error messages:');
const customValidator = validate('', {
  required: 'Username is required!'
}).custom((v) => v !== '', 'Username is required!');

console.log('  Errors:', customValidator.getErrors());

// Test 8: Conditional validation
console.log('\nConditional validation:');
const conditionResult = conditional('admin@example.com', [
  {
    condition: (v) => v.includes('admin'),
    rules: (v) => v.email()
  }
]);
console.log('  Valid:', conditionResult.valid);

// Test 9: Nested schema
console.log('\nNested schema:');
const addressSchema = nestedSchema({
  street: { type: 'string', required: true },
  city: { type: 'string', required: true }
});
const addressResult = addressSchema.validate({ street: '123 Main St', city: '' });
console.log('  Errors:', addressResult.errors);

// Test 10: Batch validation
console.log('\nBatch validation:');
const batchResults = batchValidate([
  { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
  { field: 'password', value: 'weak', rules: (v) => v.strongPassword() }
]);
const summary = batchResultSummary(batchResults);
console.log('  All valid:', summary.allValid);
console.log('  Errors:', summary.errors);

// Test 11: Async validation
console.log('\nAsync validation:');
const asyncValidator = validate('test@example.com')
  .email();
const asyncResult = await asyncValidator.isValidAsync();
console.log('  Async valid:', asyncResult);

console.log('\nAll tests complete!\n');