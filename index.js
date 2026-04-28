/**
 * @incogdev/validate - Validation library by Incognito
 * Simple, fast, zero dependencies
 */

// Core validation rules
const rules = {
  // Email validation
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(value).toLowerCase());
  },

  // Phone number (international)
  phone: (value) => {
    const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,6}[-\s\.]?[0-9]{3,6}$/;
    return regex.test(String(value));
  },

  // URL validation
  url: (value) => {
    try {
      new URL(String(value));
      return true;
    } catch {
      return false;
    }
  },

  // Not empty
  notEmpty: (value) => {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  },

  // Is number
  isNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // Is integer
  isInt: (value) => {
    return Number.isInteger(Number(value));
  },

  // Is boolean
  isBoolean: (value) => {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
  },

  // Minimum length
  minLength: (value, min) => {
    return String(value).length >= min;
  },

  // Maximum length
  maxLength: (value, max) => {
    return String(value).length <= max;
  },

  // Between numbers
  between: (value, min, max) => {
    const num = Number(value);
    return num >= min && num <= max;
  },

  // Matches regex
  matches: (value, regex) => {
    return regex.test(String(value));
  },

  // Is one of allowed values
  oneOf: (value, allowed) => {
    return allowed.includes(value);
  },

  // Strong password
  strongPassword: (value) => {
    const str = String(value);
    return (
      str.length >= 8 &&
      /[a-z]/.test(str) &&
      /[A-Z]/.test(str) &&
      /[0-9]/.test(str) &&
      /[^a-zA-Z0-9]/.test(str)
    );
  },

  // Postal code (US, Canada, UK)
  postalCode: (value, country = 'US') => {
    const patterns = {
      US: /^\d{5}(-\d{4})?$/,
      CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
      UK: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]? \d[A-Za-z]{2}$/
    };
    return patterns[country]?.test(String(value)) || false;
  },

  // Credit card (Luhn algorithm)
  creditCard: (value) => {
    const str = String(value).replace(/\s/g, '');
    if (!/^\d{13,16}$/.test(str)) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = str.length - 1; i >= 0; i--) {
      let digit = parseInt(str[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },

  // IP address
  ip: (value, version = 4) => {
    if (version === 4) {
      return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(String(value));
    }
    if (version === 6) {
      return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(String(value));
    }
    return false;
  }
};

// Chainable validator class
class Validator {
  constructor(value) {
    this.value = value;
    this.errors = [];
  }

  email() {
    if (!rules.email(this.value)) {
      this.errors.push('Invalid email address');
    }
    return this;
  }

  phone() {
    if (!rules.phone(this.value)) {
      this.errors.push('Invalid phone number');
    }
    return this;
  }

  url() {
    if (!rules.url(this.value)) {
      this.errors.push('Invalid URL');
    }
    return this;
  }

  required() {
    if (!rules.notEmpty(this.value)) {
      this.errors.push('Field is required');
    }
    return this;
  }

  minLength(min) {
    if (!rules.minLength(this.value, min)) {
      this.errors.push(`Must be at least ${min} characters`);
    }
    return this;
  }

  maxLength(max) {
    if (!rules.maxLength(this.value, max)) {
      this.errors.push(`Must be at most ${max} characters`);
    }
    return this;
  }

  isNumber() {
    if (!rules.isNumber(this.value)) {
      this.errors.push('Must be a number');
    }
    return this;
  }

  strongPassword() {
    if (!rules.strongPassword(this.value)) {
      this.errors.push('Password must contain uppercase, lowercase, number, and symbol');
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

// Helper function
function validate(value) {
  return new Validator(value);
}

// Export everything
export { rules, validate, Validator };

// Default export for convenience
export default { rules, validate, Validator };
