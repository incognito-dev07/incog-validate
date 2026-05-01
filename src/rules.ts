export const email = (value: unknown): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(value).toLowerCase());
};

export const phone = (value: unknown): boolean => {
  const regex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,6}[-\s\.]?[0-9]{3,6}$/;
  return regex.test(String(value));
};

export const url = (value: unknown): boolean => {
  try {
    new URL(String(value));
    return true;
  } catch {
    return false;
  }
};

export const notEmpty = (value: unknown): boolean => {
  return value !== null && value !== undefined && String(value).trim().length > 0;
};

export const isNumber = (value: unknown): boolean => {
  return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
};

export const isInt = (value: unknown): boolean => {
  return Number.isInteger(Number(value));
};

export const isBoolean = (value: unknown): boolean => {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
};

export const minLength = (value: unknown, min: number): boolean => {
  return String(value).length >= min;
};

export const maxLength = (value: unknown, max: number): boolean => {
  return String(value).length <= max;
};

export const between = (value: unknown, min: number, max: number): boolean => {
  const num = Number(value);
  return num >= min && num <= max;
};

export const matches = (value: unknown, regex: RegExp): boolean => {
  return regex.test(String(value));
};

export const oneOf = <T>(value: T, allowed: T[]): boolean => {
  return allowed.includes(value);
};

export const strongPassword = (value: unknown): boolean => {
  const str = String(value);
  return (
    str.length >= 8 &&
    /[a-z]/.test(str) &&
    /[A-Z]/.test(str) &&
    /[0-9]/.test(str) &&
    /[^a-zA-Z0-9]/.test(str)
  );
};

export const postalCode = (value: unknown, country: 'US' | 'CA' | 'UK' = 'US'): boolean => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d{1,2}[A-Za-z]? \d[A-Za-z]{2}$/
  };
  return patterns[country]?.test(String(value)) || false;
};

export const creditCard = (value: unknown): boolean => {
  const str = String(value).replace(/\s/g, '');
  if (!/^\d{13,16}$/.test(str)) return false;
  
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
};

export const ip = (value: unknown, version: 4 | 6 = 4): boolean => {
  if (version === 4) {
    return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(String(value));
  }
  if (version === 6) {
    return /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/.test(String(value));
  }
  return false;
};

export const rules = {
  email,
  phone,
  url,
  notEmpty,
  isNumber,
  isInt,
  isBoolean,
  minLength,
  maxLength,
  between,
  matches,
  oneOf,
  strongPassword,
  postalCode,
  creditCard,
  ip
};