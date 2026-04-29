import * as rulesModule from './rules.js';

const ruleFns = rulesModule.rules || rulesModule;

export class Validator {
  constructor(value, customMessages = {}) {
    this.value = value;
    this.errors = [];
    this.customMessages = customMessages;
  }

  _addError(ruleName, defaultMessage) {
    const message = this.customMessages[ruleName] || defaultMessage;
    this.errors.push(message);
    return this;
  }

  email() {
    if (!ruleFns.email(this.value)) {
      this._addError('email', 'Invalid email address');
    }
    return this;
  }

  phone() {
    if (!ruleFns.phone(this.value)) {
      this._addError('phone', 'Invalid phone number');
    }
    return this;
  }

  url() {
    if (!ruleFns.url(this.value)) {
      this._addError('url', 'Invalid URL');
    }
    return this;
  }

  required() {
    if (!ruleFns.notEmpty(this.value)) {
      this._addError('required', 'Field is required');
    }
    return this;
  }

  minLength(min) {
    if (!ruleFns.minLength(this.value, min)) {
      this._addError('minLength', `Must be at least ${min} characters`);
    }
    return this;
  }

  maxLength(max) {
    if (!ruleFns.maxLength(this.value, max)) {
      this._addError('maxLength', `Must be at most ${max} characters`);
    }
    return this;
  }

  isNumber() {
    if (!ruleFns.isNumber(this.value)) {
      this._addError('isNumber', 'Must be a number');
    }
    return this;
  }

  strongPassword() {
    if (!ruleFns.strongPassword(this.value)) {
      this._addError('strongPassword', 'Password must contain uppercase, lowercase, number, and symbol');
    }
    return this;
  }

  between(min, max) {
    if (!ruleFns.between(this.value, min, max)) {
      this._addError('between', `Must be between ${min} and ${max}`);
    }
    return this;
  }

  matches(regex, message = null) {
    if (!ruleFns.matches(this.value, regex)) {
      this._addError('matches', message || 'Value does not match required pattern');
    }
    return this;
  }

  oneOf(allowed) {
    if (!ruleFns.oneOf(this.value, allowed)) {
      const allowedStr = allowed.join(', ');
      this._addError('oneOf', `Value must be one of: ${allowedStr}`);
    }
    return this;
  }

  custom(rule, message) {
    if (!rule(this.value)) {
      this._addError('custom', message || 'Custom validation failed');
    }
    return this;
  }

  isValid() {
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }
}

export function validate(value, customMessages = {}) {
  return new Validator(value, customMessages);
}