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
        name: "firstName", // First Name
        type: "text",
        placeholder: "Enter your first Name...",
      },
      {
        id: 2,
        name: "lastName", // Last Name
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
        name: "confirm password",
        type: "password",
        placeholder: "Enter your Confirm Password...",
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
      },
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Enter your Password...",
      },
    ],
  },

  adminEmployee: {
    button: "Add Employee",
    endpoint: "/admin/employees",
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
        name: "confirm password",
        type: "password",
        placeholder: "Enter your Confirm Password...",
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
      {
        id: 8,
        name: "department",
        type: "select",
        options: ["Engineering", "Design", "HR", "Analytics", "Marketing"],
      },
      {
        id: 9,
        name: "designation",
        type: "select",
        options: [
          "Software Developer",
          "Frontend Developer",
          "Backend Developer",
          "Full Stack Developer",
          "UI/UX Designer",
          "HR Executive",
          "Data Analyst",
          "Marketing Executive",
        ],
      },
      {
        id: 10,
        name: "role",
        type: "select",
        options: ["Admin", "Manager", "Employee"],
      },
    ],
  },
};
