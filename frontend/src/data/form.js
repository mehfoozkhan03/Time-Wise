export const forms = {
  login: {
    button: "Login",
    endpoint: "/user/login",

    fields: [
      {
        id: 1,
        name: "Email",
        type: "text",
        placeholder: "Enter your Email...",
      },
      {
        id: 2,
        name: "Password",
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
        name: "FirstName",
        type: "text",
        placeholder: "Enter your first Name...",
      },
      {
        id: 2,
        name: "LastName",
        type: "text",
        placeholder: "Enter your Last Name...",
      },
      {
        id: 3,
        name: "Email",
        type: "text",
        placeholder: "Enter your Email...",
      },
      {
        id: 4,
        name: "Password",
        type: "password",
        placeholder: "Enter your Password...",
      },
      {
        id: 5,
        name: "ConfirmPassword",
        type: "password",
        placeholder: "Enter your Confirm Password...",
      },
      {
        id: 6,
        name: "Dob",
        type: "date",
        placeholder: "",
      },
      {
        id: 7,
        name: "Gender",
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
        name: "Email",
        type: "text",
        placeholder: "Enter your Email...",
      },
      {
        id: 2,
        name: "Password",
        type: "password",
        placeholder: "Enter your Password...",
      },
    ],
  },
};
