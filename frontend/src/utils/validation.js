// utils/validation.js

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nameRegex = /^[A-Za-z]{2,50}$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// --------------------------------------------------
// Generic validator
// --------------------------------------------------

export const validateForm = (form, fields) => {
  const errors = {};

  fields.forEach((field) => {
    const value = form[field.name];

    // Required validation
    if (field.required) {
      const isEmpty =
        value === undefined || value === null || String(value).trim() === '';

      if (isEmpty) {
        errors[field.name] =
          field.requiredMessage || `${field.label || field.name} is required`;

        return;
      }
    }

    // Regex validation
    if (field.pattern && value && !field.pattern.test(value)) {
      errors[field.name] =
        field.patternMessage || `Invalid ${field.label || field.name}`;

      return;
    }

    // Custom validation
    if (field.validate) {
      const error = field.validate(value, form);

      if (error) {
        errors[field.name] = error;
      }
    }
  });

  return errors;
};

// --------------------------------------------------
// Validation helpers
// --------------------------------------------------

export const required = (message = 'This field is required') => ({
  required: true,
  requiredMessage: message,
});

export const emailValidation = {
  required: true,
  requiredMessage: 'Email is required',

  pattern: emailRegex,

  patternMessage: 'Invalid email',
};

export const nameValidation = (fieldName) => ({
  required: true,

  requiredMessage: `${fieldName} is required`,

  pattern: nameRegex,

  patternMessage: `${fieldName} should be 2-50 letters`,
});

export const passwordValidation = {
  required: true,

  requiredMessage: 'Password is required',

  pattern: passwordRegex,

  patternMessage:
    'Password must be 8+ characters with uppercase, lowercase, number & special character',
};

/* 
gpt response :- https://chatgpt.com/c/6ab411b9-afcc-83e8-9ae6-5028d03c1d33
*/
