import { schema, SchemaDefinition } from './schema.js';

export function nestedSchema<T extends Record<string, any>>(
  definition: SchemaDefinition
) {
  const validator = schema(definition);
  
  return {
    validate(data: T): { valid: boolean; errors: Record<string, string[]>; data: T } {
      const result = validator.validate(data);
      return {
        valid: result.valid,
        errors: result.errors,
        data
      };
    },
    
    partial(data: Partial<T>): { valid: boolean; errors: Record<string, string[]>; data: Partial<T> } {
      const result = validator.validate(data as T);
      return {
        valid: result.valid,
        errors: result.errors,
        data
      };
    }
  };
}

export function deepValidate<T extends Record<string, any>>(
  data: T,
  definition: SchemaDefinition,
  path: string = ''
): { valid: boolean; errors: Record<string, string[]> } {
  const result = schema(definition).validate(data);
  
  const prefixedErrors: Record<string, string[]> = {};
  for (const [key, errors] of Object.entries(result.errors)) {
    prefixedErrors[path ? `${path}.${key}` : key] = errors;
  }
  
  return {
    valid: result.valid,
    errors: prefixedErrors
  };
}