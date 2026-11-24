// // utils/validation.js

// export const emailRegex = /^[^\s@]+@timewise\.org$/i;
// // export const emailRegex = /^[^\s@]+@[^\s@]+\timewise\.[^\s@]+$/;

// export const nameRegex = /^[A-Za-z]{2,50}$/;

// export const passwordRegex =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// // --------------------------------------------------
// // Generic validator
// // --------------------------------------------------

// export const validateForm = (form, fields) => {
//   const errors = {};

//   fields.forEach((field) => {
//     const value = form[field.name];

//     // Required validation
//     if (field.required) {
//       const isEmpty =
//         value === undefined || value === null || String(value).trim() === "";

//       if (isEmpty) {
//         errors[field.name] =
//           field.requiredMessage || `${field.label || field.name} is required`;

//         return;
//       }
//     }

//     // Regex validation
//     if (field.pattern && value && !field.pattern.test(value)) {
//       errors[field.name] =
//         field.patternMessage || `Invalid ${field.label || field.name}`;

//       return;
//     }

//     // Custom validation
//     if (field.validate) {
//       const error = field.validate(value, form);

//       if (error) {
//         errors[field.name] = error;
//       }
//     }
//   });

//   return errors;
// };

// // --------------------------------------------------
// // Validation helpers
// // --------------------------------------------------

// export const required = (message = "This field is required") => ({
//   required: true,
//   requiredMessage: message,
// });

// export const emailValidation = {
//   required: true,
//   requiredMessage: "Email is required",

//   pattern: emailRegex,

//   patternMessage: "Email must use the @timewise.org domain",
// };

// export const nameValidation = (fieldName) => ({
//   required: true,

//   requiredMessage: `${fieldName} is required`,

//   pattern: nameRegex,

//   patternMessage: `${fieldName} should be 2-50 letters`,
// });

// export const passwordValidation = {
//   required: true,

//   requiredMessage: "Password is required",

//   pattern: passwordRegex,

//   patternMessage:
//     "Password must be 8+ characters with uppercase, lowercase, number & special character",
// };

// /* 
// gpt response :- https://chatgpt.com/c/6ab411b9-afcc-83e8-9ae6-5028d03c1d33
// */



export const emailRegex = /^[^\s@]+@timewise\.org$/i;

export const nameRegex = /^[A-Za-z]{2,50}$/;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Main validation function
export const validateForm = (form, endpoint) => {
  const errors = {};

  // Signup Validation
  if (endpoint === "/user/signup") {
    const firstName = form.firstName?.trim() || "";
    const lastName = form.lastName?.trim() || "";
    const email = form.email?.trim() || "";
    const password = form.password || "";
    const confirmPassword = form["confirm password"] || "";
    const dob = form.dob || "";
    const gender = form.gender || "";

    // First Name
    if (!firstName) {
      errors.firstName = "First name is required";
    } else if (!nameRegex.test(firstName)) {
      errors.firstName = "First name must contain 2-50 letters";
    }

    // Last Name
    if (!lastName) {
      errors.lastName = "Last name is required";
    } else if (!nameRegex.test(lastName)) {
      errors.lastName = "Last name must contain 2-50 letters";
    }

    // Email
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email must use the @timewise.org domain";
    }

    // Password
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must contain 8+ characters, uppercase, lowercase, number and special character";
    }

    // Confirm Password
    if (!confirmPassword.trim()) {
      errors["confirm password"] = "Confirm password is required";
    } else if (confirmPassword !== password) {
      errors["confirm password"] =
        "Password and confirm password do not match";
    }

    // DOB
    if (!dob.trim()) {
      errors.dob = "Date of birth is required";
    }

    // Gender
    if (!gender.trim()) {
      errors.gender = "Please select your gender";
    }
  }

  // User Login and Admin Login
  else if (
    endpoint === "/user/login" ||
    endpoint === "/admin/login"
  ) {
    const email = form.email?.trim() || "";
    const password = form.password || "";

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Email must use the @timewise.org domain";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }
  }

  return errors;
};
