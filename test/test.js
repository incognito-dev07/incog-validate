import { validate, rules } from '../index.js';

console.log('\n🔍 Testing @incog/validate\n');

// Test email validation
console.log('📧 Email:');
console.log('  test@example.com:', rules.email('test@example.com') ? '✓' : '✗');
console.log('  invalid-email:', rules.email('invalid-email') ? '✓' : '✗');

// Test phone validation
console.log('\n📞 Phone:');
console.log('  +1234567890:', rules.phone('+1234567890') ? '✓' : '✗');
console.log('  abc:', rules.phone('abc') ? '✓' : '✗');

// Test chainable validator
console.log('\n🔗 Chainable validator:');
const result = validate('test@example.com')
  .required()
  .email()
  .minLength(5)
  .maxLength(100);

console.log('  Valid:', result.isValid());
console.log('  Errors:', result.getErrors());

// Test password
console.log('\n🔐 Strong password:');
console.log('  Pass123!:', rules.strongPassword('Pass123!') ? '✓' : '✗');
console.log('  weak:', rules.strongPassword('weak') ? '✓' : '✗');

console.log('\n✅ All tests complete!\n');