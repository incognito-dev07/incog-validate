import * as rulesModule from './rules.js';

const ruleFns = rulesModule.rules || rulesModule;

export type CustomMessages = Record<string, string>;

export class Validator<T = any> {
  private value: T;
  private errors: string[];
  private customMessages: CustomMessages;

  constructor(value: T, customMessages: CustomMessages = {}) {
    this.value = value;
    this.errors = [];
    this.customMessages = customMessages;
  }

  private _addError(ruleName: string, defaultMessage: string): this {
    const message = this.customMessages[ruleName] || defaultMessage;
    this.errors.push(message);
    return this;
  }

  email(): this {
    if (!ruleFns.email(this.value)) {
      this._addError('email', 'Invalid email address');
    }
    return this;
  }

  phone(): this {
    if (!ruleFns.phone(this.value)) {
      this._addError('phone', 'Invalid phone number');
    }
    return this;
  }

  url(): this {
    if (!ruleFns.url(this.value)) {
      this._addError('url', 'Invalid URL');
    }
    return this;
  }

  required(): this {
    if (!ruleFns.notEmpty(this.value)) {
      this._addError('required', 'Field is required');
    }
    return this;
  }

  minLength(min: number): this {
    if (!ruleFns.minLength(this.value, min)) {
      this._addError('minLength', `Must be at least ${min} characters`);
    }
    return this;
  }

  maxLength(max: number): this {
    if (!ruleFns.maxLength(this.value, max)) {
      this._addError('maxLength', `Must be at most ${max} characters`);
    }
    return this;
  }

  isNumber(): this {
    if (!ruleFns.isNumber(this.value)) {
      this._addError('isNumber', 'Must be a number');
    }
    return this;
  }

  strongPassword(): this {
    if (!ruleFns.strongPassword(this.value)) {
      this._addError('strongPassword', 'Password must contain uppercase, lowercase, number, and symbol');
    }
    return this;
  }

  between(min: number, max: number): this {
    if (!ruleFns.between(this.value, min, max)) {
      this._addError('between', `Must be between ${min} and ${max}`);
    }
    return this;
  }

  matches(regex: RegExp, message: string | null = null): this {
    if (!ruleFns.matches(this.value, regex)) {
      this._addError('matches', message || 'Value does not match required pattern');
    }
    return this;
  }

  oneOf(allowed: any[]): this {
    if (!ruleFns.oneOf(this.value, allowed)) {
      const allowedStr = allowed.join(', ');
      this._addError('oneOf', `Value must be one of: ${allowedStr}`);
    }
    return this;
  }

  custom(rule: (value: T) => boolean, message: string): this {
    if (!rule(this.value)) {
      this._addError('custom', message || 'Custom validation failed');
    }
    return this;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  getErrors(): string[] {
    return [...this.errors];
  }
}

export function validate<T>(value: T, customMessages: CustomMessages = {}): Validator<T> {
  return new Validator(value, customMessages);
}