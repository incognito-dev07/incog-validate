// Main entry point for @incogdev/validate

import { rules } from './lib/rules.js';
import { validate, Validator } from './lib/validator.js';
import { schema } from './lib/schema.js';

export { rules, validate, Validator, schema };

export default {
  rules,
  validate,
  Validator,
  schema
};