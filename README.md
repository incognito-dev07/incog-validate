# @incogdev/validate

Simple, fast, type-safe validation library. Zero dependencies.

## Installation

```bash
npm install @incogdev/validate
```

Usage

Basic validation

```javascript
import { rules } from '@incogdev/validate';

rules.email('user@example.com');     // true
rules.phone('+1234567890');          // true
rules.url('https://google.com');     // true
rules.strongPassword('Pass123!');    // true
```

Chainable validator

```javascript
import { validate } from '@incogdev/validate';

const check = validate('test@example.com')
  .required()
  .email()
  .minLength(5)
  .maxLength(100);

if (check.isValid()) {
  console.log('Valid!');
} else {
  console.log(check.getErrors());
}
```

Custom error messages

```javascript
const check = validate('', {
  required: 'Username is required!'
}).required();
```

Schema validation

```javascript
import { schema } from '@incogdev/validate';

const userSchema = schema({
  name: { type: 'string', required: true, min: 2, max: 50 },
  email: { type: 'email', required: true },
  age: { type: 'number', min: 0, max: 150 }
});

const result = userSchema.validate({
  name: 'John',
  email: 'john@example.com',
  age: 25
});

if (result.valid) {
  console.log('Valid user!');
} else {
  console.log(result.errors);
}
```

Custom rules

```javascript
validate(value)
  .custom((v) => v > 10, 'Value must be greater than 10')
  .isValid();
```