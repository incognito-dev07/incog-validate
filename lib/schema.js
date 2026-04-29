import { email, phone, url, isNumber, minLength, maxLength } from './rules.js';

const typeValidators = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !isNaN(v),
  boolean: (v) => typeof v === 'boolean',
  email: (v) => email(v),
  phone: (v) => phone(v),
  url: (v) => url(v)
};

export function schema(schemaDefinition) {
  return {
    validate(data) {
      const errors = {};
      let isValid = true;

      for (const [field, fieldRules] of Object.entries(schemaDefinition)) {
        const value = data[field];
        const fieldErrors = [];

        // Required check
        if (fieldRules.required && (value === undefined || value === null || value === '')) {
          fieldErrors.push(fieldRules.message || `${field} is required`);
          isValid = false;
        }

        // Skip further validation if value is empty and not required
        if ((value === undefined || value === null || value === '') && !fieldRules.required) {
          continue;
        }

        // Type validation
        if (fieldRules.type && typeValidators[fieldRules.type]) {
          if (!typeValidators[fieldRules.type](value)) {
            fieldErrors.push(`${field} must be a ${fieldRules.type}`);
            isValid = false;
          }
        }

        // Min length
        if (fieldRules.min !== undefined && String(value).length < fieldRules.min) {
          fieldErrors.push(`${field} must be at least ${fieldRules.min} characters`);
          isValid = false;
        }

        // Max length
        if (fieldRules.max !== undefined && String(value).length > fieldRules.max) {
          fieldErrors.push(`${field} must be at most ${fieldRules.max} characters`);
          isValid = false;
        }

        // Pattern
        if (fieldRules.pattern && !fieldRules.pattern.test(String(value))) {
          fieldErrors.push(fieldRules.patternMessage || `${field} has invalid format`);
          isValid = false;
        }

        // Custom validator
        if (fieldRules.custom && !fieldRules.custom(value)) {
          fieldErrors.push(fieldRules.customMessage || `${field} validation failed`);
          isValid = false;
        }

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      }

      return { valid: isValid, errors };
    }
  };
}