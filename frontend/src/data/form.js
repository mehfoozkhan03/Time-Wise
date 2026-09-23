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
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
      },
    ],
  },

  signup: {
    button: "Signup",
    endpoint: "/user/signup",

    fields: [
      {
        id: 1,
        name: "firstName",
        type: "text",
        placeholder: "Enter your first Name...",
      },
      {
        id: 2,
        name: "lastName",
        type: "text",
        placeholder: "Enter your Last Name...",
      },
      {
        id: 3,
        name: "email",
        type: "text",
        placeholder: "Enter your Email...",
      },
      {
        id: 4,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
      },
      {
        id: 5,
        name: "confirmPassword",
        type: "password",
        placeholder: "Enter your Confirm Password...",
      },
      {
        id: 6,
        name: "dob",
        type: "date",
        placeholder: "",
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
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
      },
    ],
  },
};