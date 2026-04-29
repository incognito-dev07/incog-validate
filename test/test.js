import { validate, rules, schema } from '../index.js';

console.log('\n🔍 Testing @incogdev/validate v2.0\n');

// Test 1: Basic rules
console.log('📧 Email validation:');
console.log('  test@example.com:', rules.email('test@example.com') ? '✓' : '✗');
console.log('  invalid:', rules.email('invalid') ? '✓' : '✗');

// Test 2: Phone validation
console.log('\n📞 Phone validation:');
console.log('  +1234567890:', rules.phone('+1234567890') ? '✓' : '✗');
console.log('  abc:', rules.phone('abc') ? '✓' : '✗');

// Test 3: URL validation
console.log('\n🌐 URL validation:');
console.log('  https://google.com:', rules.url('https://google.com') ? '✓' : '✗');
console.log('  not-a-url:', rules.url('not-a-url') ? '✓' : '✗');

// Test 4: Chainable validator
console.log('\n🔗 Chainable validator:');
const result = validate('test@example.com')
  .required()
  .email()
  .minLength(5)
  .maxLength(100);

console.log('  Valid:', result.isValid());
console.log('  Errors:', result.getErrors());

// Test 5: Password strength
console.log('\n🔐 Strong password:');
console.log('  Pass123!:', rules.strongPassword('Pass123!') ? '✓' : '✗');
console.log('  weak:', rules.strongPassword('weak') ? '✓' : '✗');

// Test 6: Schema validation
console.log('\n📋 Schema validation:');
const userSchema = schema({
  name: { type: 'string', required: true, min: 2, max: 50 },
  email: { type: 'email', required: true },
  age: { type: 'number', min: 0, max: 150 }
});

const validUser = { name: 'John', email: 'john@example.com', age: 25 };
const invalidUser = { name: 'J', email: 'not-an-email', age: 200 };

const validResult = userSchema.validate(validUser);
const invalidResult = userSchema.validate(invalidUser);

console.log('  Valid user:', validResult.valid ? '✓' : '✗');
console.log('  Invalid user:', invalidResult.valid ? '✓' : '✗');
console.log('  Errors:', invalidResult.errors);

// Test 7: Custom error messages
console.log('\n💬 Custom error messages:');
const customValidator = validate('', {
  required: 'Username is required!'
}).required();

console.log('  Valid:', customValidator.isValid());
console.log('  Errors:', customValidator.getErrors());

// Test 8: OneOf validation
console.log('\n🎯 OneOf validation:');
console.log('  red in [red, blue, green]:', rules.oneOf('red', ['red', 'blue', 'green']) ? '✓' : '✗');
console.log('  yellow in [red, blue, green]:', rules.oneOf('yellow', ['red', 'blue', 'green']) ? '✓' : '✗');

console.log('\n✅ All tests complete!\n');