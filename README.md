# @incog/validate

Simple, fast validation library by Incognito. Zero dependencies.

## Installation

```bash
npm install @incog/validate
```

Usage

Basic validation

```javascript
import { rules } from '@incog/validate';

rules.email('user@example.com');     // true
rules.phone('+1234567890');          // true
rules.url('https://google.com');     // true
rules.strongPassword('Pass123!');    // true
```

Chainable validator

```javascript
import { validate } from '@incog/validate';

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

Available rules

Rule Description
email(value) Valid email address
phone(value) International phone number
url(value) Valid URL
notEmpty(value) Not null/undefined/empty
isNumber(value) Is a number
isInt(value) Is an integer
minLength(value, min) Minimum length
maxLength(value, max) Maximum length
between(value, min, max) Between two numbers
strongPassword(value) Strong password
creditCard(value) Valid credit card
ip(value, version) IPv4 or IPv6

License

MIT