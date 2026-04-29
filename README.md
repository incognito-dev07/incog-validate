# @incogdev/validate

Simple, fast, type-safe validation library. Zero dependencies. Works in Node.js and browser.

## Installation

```bash
npm install @incogdev/validate
```

## Quick Start

```javascript
import { validate } from '@incogdev/validate';

const result = validate('user@example.com')
  .required()
  .email()
  .isValid();

console.log(result); // true
```

## Basic Rules

```javascript
import { rules } from '@incogdev/validate';

// Email validation
rules.email('john@example.com');     // true
rules.email('invalid-email');        // false

// Phone number (international format)
rules.phone('+1234567890');          // true
rules.phone('+1 (555) 123-4567');    // true
rules.phone('abc123');               // false

// URL validation
rules.url('https://google.com');     // true
rules.url('http://localhost:3000');  // true
rules.url('not-a-url');              // false

// Check if value is not empty
rules.notEmpty('hello');             // true
rules.notEmpty('');                  // false
rules.notEmpty(null);                // false
rules.notEmpty(undefined);           // false

// Number validation
rules.isNumber(42);                  // true
rules.isNumber('3.14');              // true
rules.isNumber('abc');               // false

// Integer validation
rules.isInt(42);                     // true
rules.isInt(3.14);                   // false
rules.isInt('100');                  // true

// Boolean validation
rules.isBoolean(true);               // true
rules.isBoolean(false);              // true
rules.isBoolean('true');             // true
rules.isBoolean('false');            // true
rules.isBoolean('yes');              // false

// String length
rules.minLength('hello', 3);         // true
rules.minLength('hi', 3);            // false
rules.maxLength('hello', 10);        // true
rules.maxLength('hello world', 5);   // false

// Number range
rules.between(50, 0, 100);           // true
rules.between(150, 0, 100);          // false

// Regex pattern matching
rules.matches('abc123', /^[a-z]{3}\d{3}$/);  // true
rules.matches('abc', /^[a-z]{3}\d{3}$/);     // false

// Value must be in allowed list
rules.oneOf('apple', ['apple', 'banana', 'orange']);     // true
rules.oneOf('grape', ['apple', 'banana', 'orange']);     // false

// Strong password
rules.strongPassword('Pass123!');    // true
rules.strongPassword('weak');        // false
rules.strongPassword('password123'); // false

// Postal code by country
rules.postalCode('90210');           // true
rules.postalCode('90210-1234');      // true
rules.postalCode('M5V 2T6', 'CA');   // true
rules.postalCode('SW1A 1AA', 'UK');  // true

// Credit card (Luhn algorithm)
rules.creditCard('4532015112830366');  // true
rules.creditCard('1234567890123456');  // false

// IP address
rules.ip('192.168.1.1');               // true
rules.ip('::1');                       // true
rules.ip('999.999.999.999');           // false
```

## Chainable Validator

```javascript
import { validate } from '@incogdev/validate';

const validator = validate('john@example.com')
  .required()
  .email()
  .minLength(5)
  .maxLength(100);

console.log(validator.isValid());   // true
console.log(validator.getErrors()); // []
```

### Checking Validation Result

```javascript
const validator = validate('invalid')
  .required()
  .email();

if (validator.isValid()) {
  console.log('Email is valid!');
} else {
  console.log('Errors:', validator.getErrors());
}
```

### Available Chainable Methods

| Method | Description |
|--------|-------------|
| `.email()` | Validates email format |
| `.phone()` | Validates phone number |
| `.url()` | Validates URL |
| `.required()` | Value cannot be empty |
| `.minLength(n)` | Minimum character length |
| `.maxLength(n)` | Maximum character length |
| `.isNumber()` | Must be a number |
| `.strongPassword()` | Password strength check |
| `.between(min, max)` | Number between range |
| `.matches(regex)` | Matches regex pattern |
| `.oneOf([...])` | Value must be in array |
| `.custom(fn, msg)` | Custom validation function |

### Method Chaining Order

```javascript
const result = validate('')
  .required()
  .email()
  .minLength(3)
  .isValid();  // false
```

## Custom Error Messages

```javascript
import { validate } from '@incogdev/validate';

const validator = validate('', {
  required: 'Username cannot be empty!',
  email: 'Please enter a valid email address',
  minLength: 'Must be at least {min} characters'
})
  .required()
  .email()
  .minLength(5);

console.log(validator.getErrors());
// ['Username cannot be empty!', 'Please enter a valid email address']
```

### Available Error Message Keys

| Key | Default Message |
|-----|-----------------|
| `email` | "Invalid email address" |
| `phone` | "Invalid phone number" |
| `url` | "Invalid URL" |
| `required` | "Field is required" |
| `minLength` | "Must be at least X characters" |
| `maxLength` | "Must be at most X characters" |
| `isNumber` | "Must be a number" |
| `strongPassword` | "Password must contain uppercase, lowercase, number, and symbol" |
| `between` | "Must be between X and Y" |
| `matches` | "Value does not match required pattern" |
| `oneOf` | "Value must be one of: ..." |

## Schema Validation

Validate entire objects with a schema definition.

### Basic Schema

```javascript
import { schema } from '@incogdev/validate';

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true },
  age: { type: 'number' }
});

const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25
});

console.log(result.valid);   // true
console.log(result.errors);  // {}
```

### Schema with Length Constraints

```javascript
const userSchema = schema({
  username: { 
    type: 'string', 
    required: true, 
    min: 3, 
    max: 20 
  },
  bio: { 
    type: 'string', 
    max: 200 
  }
});

const result = userSchema.validate({
  username: 'jo',
  bio: 'a'.repeat(201)
});

console.log(result.valid);  // false
console.log(result.errors);
// {
//   username: ['username must be at least 3 characters'],
//   bio: ['bio must be at most 200 characters']
// }
```

### Schema with Pattern Validation

```javascript
const productSchema = schema({
  sku: { 
    type: 'string', 
    required: true,
    pattern: /^[A-Z]{3}-\d{4}$/,
    patternMessage: 'SKU must be format XXX-0000'
  }
});

const result = productSchema.validate({ sku: 'ABC-123' });
console.log(result.valid);   // false
console.log(result.errors.sku[0]);
```

### Schema with Custom Validation

```javascript
const orderSchema = schema({
  total: {
    type: 'number',
    custom: (value) => value > 0,
    customMessage: 'Total must be greater than 0'
  }
});

const result = orderSchema.validate({ total: -10 });
console.log(result.valid);   // false
```

### Schema Types Reference

| Type | Description | Validation |
|------|-------------|------------|
| `'string'` | Any string | `typeof value === 'string'` |
| `'number'` | Any number | `typeof value === 'number'` |
| `'boolean'` | Boolean | `typeof value === 'boolean'` |
| `'email'` | Email format | Uses `rules.email()` |
| `'phone'` | Phone number | Uses `rules.phone()` |
| `'url'` | URL format | Uses `rules.url()` |

### Schema Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `type` | string | One of the types above |
| `required` | boolean | If true, value cannot be empty |
| `min` | number | Minimum length (strings) or value (numbers) |
| `max` | number | Maximum length (strings) or value (numbers) |
| `pattern` | RegExp | Regex pattern to match |
| `patternMessage` | string | Custom message for pattern failure |
| `custom` | function | Custom validation function |
| `customMessage` | string | Custom message for custom validation |
| `message` | string | Custom message for required failure |

## Custom Rules

Create your own validation rules using the `.custom()` method.

### Basic Custom Rule

```javascript
import { validate } from '@incogdev/validate';

const validator = validate(7)
  .custom((value) => value % 2 === 0, 'Number must be even');

console.log(validator.isValid());  // false
console.log(validator.getErrors());  // ['Number must be even']
```

### Reusable Custom Rule Function

```javascript
function isDivisibleBy(divisor) {
  return (value) => value % divisor === 0;
}

const validator = validate(10)
  .custom(isDivisibleBy(3), 'Must be divisible by 3');

console.log(validator.isValid());  // false
```

### Combining with Built-in Rules

```javascript
const validator = validate('abc123')
  .required()
  .minLength(3)
  .custom((value) => /^\w+$/.test(value), 'Only letters, numbers, and underscores')
  .isValid();
```

## TypeScript Support

Full TypeScript support with type inference.

### Basic Types

```typescript
import { validate, rules, schema, Validator } from '@incogdev/validate';

// Rules return boolean
const isValid: boolean = rules.email('test@example.com');

// Validator returns typed instance
const validator: Validator<string> = validate('test')
  .required()
  .minLength(3);

// Schema with typed data
interface User {
  name: string;
  email: string;
  age?: number;
}

const userSchema = schema<User>({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true },
  age: { type: 'number' }
});
```

## Express.js Example

```javascript
import { validate } from '@incogdev/validate';

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  const emailValid = validate(email).required().email();
  const passwordValid = validate(password).required().strongPassword();
  
  if (!emailValid.isValid() || !passwordValid.isValid()) {
    return res.status(400).json({
      errors: [...emailValid.getErrors(), ...passwordValid.getErrors()]
    });
  }
  
  // Proceed with registration
});
```

## React Form Example

```jsx
import { useState } from 'react';
import { validate } from '@incogdev/validate';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validator = validate(email)
      .required()
      .email();
    
    if (!validator.isValid()) {
      setErrors(validator.getErrors());
      return;
    }
    
    // Submit form
    console.log('Form submitted:', email);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      {errors.map((err, i) => (
        <div key={i} style={{ color: 'red' }}>{err}</div>
      ))}
      <button type="submit">Login</button>
    </form>
  );
}
```

## API Reference

### CommonJS Import

```javascript
const { rules, validate, schema } = require('@incogdev/validate');
```

### Async Validation

```javascript
async function validateUser(email) {
  // Sync validation first
  if (!rules.email(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Async check (e.g., email already exists)
  const exists = await db.checkEmailExists(email);
  if (exists) {
    return { valid: false, error: 'Email already taken' };
  }
  
  return { valid: true };
}
```