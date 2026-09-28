
import { nameValidation, emailValidation, passwordValidation } from "../utils/validation"


export const forms = {
  login: {
    button: "Login",
    endpoint: "/user/login",

    fields: [
      {
        id: 1,
        name: "email",
        type: "text",
        placeholder: "Enter your Email...",
        ...emailValidation,
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
        ...passwordValidation,
      },
    ],
  },

  signup: {
    button: "Signup",
    endpoint: "/user/signup",

    fields: [
      {
        id: 1,
        name: "first name",
        type: "text",
        placeholder: "Enter your first Name...",
        ...nameValidation("First name"),
      },
      {
        id: 2,
        name: "last name",
        type: "text",
        placeholder: "Enter your Last Name...",
        ...nameValidation("Last name"),
      },
      {
        id: 3,
        name: "email",
        type: "text",
        placeholder: "Enter your Email...",
        ...emailValidation,
      },
      {
        id: 4,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
        ...passwordValidation,
      },
      {
        id: 5,
        name: "confirm password",
        type: "password",
        placeholder: "Enter your Confirm Password...",
        ...passwordValidation,
      },
      {
        id: 6,
        name: "dob",
        type: "date",
        placeholder: "",
      },
      {
        id: 7,
        name: "gender",
        type: "select",
        options: ["Male", "Female", "Other"],
      },
    ],
  },

  admin: {
    button: "Admin Login",
    endpoint: "/admin/login",

    fields: [
      {
        id: 1,
        name: "email",
        type: "text",
        placeholder: "Enter your Email...",
        ...emailValidation,
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
        ...passwordValidation,
      },
    ],
  },
};
