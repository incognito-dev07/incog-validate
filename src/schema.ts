import { email, phone, url } from './rules.js';

type SchemaType = 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url';

export interface SchemaRule {
  type?: SchemaType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: any) => boolean;
  customMessage?: string;
  message?: string;
}

type SchemaDefinition = Record<string, SchemaRule>;

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

const typeValidators: Record<SchemaType, (v: any) => boolean> = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !isNaN(v),
  boolean: (v) => typeof v === 'boolean',
  email: (v) => email(v),
  phone: (v) => phone(v),
  url: (v) => url(v)
};

export function schema(schemaDefinition: SchemaDefinition) {
  return {
    validate(data: Record<string, any>): ValidationResult {
      const errors: Record<string, string[]> = {};
      let isValid = true;

      for (const [field, fieldRules] of Object.entries(schemaDefinition)) {
        const value = data[field];
        const fieldErrors: string[] = [];

        if (fieldRules.required && (value === undefined || value === null || value === '')) {
          fieldErrors.push(fieldRules.message || `${field} is required`);
          isValid = false;
        }

        if ((value === undefined || value === null || value === '') && !fieldRules.required) {
          continue;
        }

        if (fieldRules.type && typeValidators[fieldRules.type]) {
          if (!typeValidators[fieldRules.type](value)) {
            fieldErrors.push(`${field} must be a ${fieldRules.type}`);
            isValid = false;
          }
        }

        if (fieldRules.min !== undefined && String(value).length < fieldRules.min) {
          fieldErrors.push(`${field} must be at least ${fieldRules.min} characters`);
          isValid = false;
        }

        if (fieldRules.max !== undefined && String(value).length > fieldRules.max) {
          fieldErrors.push(`${field} must be at most ${fieldRules.max} characters`);
          isValid = false;
        }

        if (fieldRules.pattern && !fieldRules.pattern.test(String(value))) {
          fieldErrors.push(fieldRules.patternMessage || `${field} has invalid format`);
          isValid = false;
        }

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