// Type definitions for @incogdev/validate

export type ValidationRule<T = any> = (value: T, ...args: any[]) => boolean;

export interface ValidationRules {
  email(value: string): boolean;
  phone(value: string): boolean;
  url(value: string): boolean;
  notEmpty(value: any): boolean;
  isNumber(value: any): boolean;
  isInt(value: any): boolean;
  isBoolean(value: any): boolean;
  minLength(value: string, min: number): boolean;
  maxLength(value: string, max: number): boolean;
  between(value: number, min: number, max: number): boolean;
  matches(value: string, regex: RegExp): boolean;
  oneOf<T>(value: T, allowed: T[]): boolean;
  strongPassword(value: string): boolean;
  postalCode(value: string, country?: 'US' | 'CA' | 'UK'): boolean;
  creditCard(value: string): boolean;
  ip(value: string, version?: 4 | 6): boolean;
}

export const rules: ValidationRules;

export class Validator<T = any> {
  constructor(value: T, customMessages?: Record<string, string>);
  email(): this;
  phone(): this;
  url(): this;
  required(): this;
  minLength(min: number): this;
  maxLength(max: number): this;
  isNumber(): this;
  strongPassword(): this;
  between(min: number, max: number): this;
  matches(regex: RegExp, message?: string): this;
  oneOf(allowed: any[]): this;
  custom(rule: (value: T) => boolean, message: string): this;
  isValid(): boolean;
  getErrors(): string[];
}

export function validate<T>(value: T, customMessages?: Record<string, string>): Validator<T>;

export interface SchemaRule {
  type?: 'string' | 'number' | 'boolean' | 'email' | 'phone' | 'url';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: any) => boolean;
  customMessage?: string;
  message?: string;
}

export function schema(schemaDefinition: Record<string, SchemaRule>): {
  validate(data: Record<string, any>): { valid: boolean; errors: Record<string, string[]> };
};

export default {
  rules: ValidationRules;
  validate: typeof validate;
  Validator: typeof Validator;
  schema: typeof schema;
};