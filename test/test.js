import { validate, rules, schema } from '../dist/index.js';

console.log('\n🔍 Testing @incogdev/validate v3.0\n');

console.log('📧 Email validation:');
console.log('  test@example.com:', rules.email('test@example.com') ? '✓' : '✗');
console.log('  invalid:', rules.email('invalid') ? '✓' : '✗');

console.log('\n📞 Phone validation:');
console.log('  +1234567890:', rules.phone('+1234567890') ? '✓' : '✗');
console.log('  abc:', rules.phone('abc') ? '✓' : '✗');

console.log('\n🌐 URL validation:');
console.log('  https://google.com:', rules.url('https://google.com') ? '✓' : '✗');
console.log('  not-a-url:', rules.url('not-a-url') ? '✓' : '✗');

console.log('\n🔗 Chainable validator:');
const result = validate('test@example.com')
  .required()
  .email()
  .minLength(5)
  .maxLength(100);

console.log('  Valid:', result.isValid());
console.log('  Errors:', result.getErrors());

console.log('\n🔐 Strong password:');
console.log('  Pass123!:', rules.strongPassword('Pass123!') ? '✓' : '✗');
console.log('  weak:', rules.strongPassword('weak') ? '✓' : '✗');

console.log('\n📋 Schema validation:');
const userSchema = schema({
  name: { type: 'string', required: true, min: 2, max: 50 },
  email: { type: 'email', required: true },
  age: { type: 'number', min: 0, max: 150 }
});

const invalidUser = { name: 'J', email: 'not-an-email', age: 200 };
const invalidResult = userSchema.validate(invalidUser);

console.log('  Errors:', invalidResult.errors);

console.log('\n💬 Custom error messages:');
const customValidator = validate('', {
  required: 'Username is required!'
}).required();

console.log('  Errors:', customValidator.getErrors());

console.log('\n✅ All tests complete!\n');