import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { validateForm } from "../utils/validation";
import { Modal } from "../components/Modal/Modal";
import { registerUser, loginUser } from "../store/authSlice";
import { createEmployee, loginAdmin } from "../store/adminAuthSlice";
import "../styles/Form.css";

export const Form = ({
  fields = [],
  button = "Submit",
  endpoint,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showModalRef = React.useRef();

  // Form state
  const [form, setForm] = React.useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  });

  const { isloading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = React.useState({});
  const [openSelect, setOpenSelect] = React.useState(null);
  const [errors, setErrors] = React.useState({});

  // Reset the complete form
  const resetForm = () => {
    setForm(
      fields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
      }, {}),
    );

    setErrors({});
    setShowPassword({});
    setOpenSelect(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("endpoint", endpoint);

    const validationErrors = validateForm(form, fields);
    setErrors(validationErrors);

    // Stop API call if validation failed
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      let response;

      // Registration
      if (endpoint === "/user/signup") {
        response = await dispatch(registerUser(form));
      }

      // User login
      if (endpoint === "/user/login") {
        response = await dispatch(loginUser(form));
      }

      // Admin login
      if (endpoint === "/admin/login") {
        response = await dispatch(loginAdmin(form));
      }

      //# Admin can add employee
      if (endpoint === "/admin/employees") {
        const { ["confirm password"]: _, ...employeeData } = form;

        response = await dispatch(createEmployee(employeeData));

        if (createEmployee.fulfilled.match(response)) {
          showModalRef.current({
            variant: "success",
            title: response.payload?.title || "Employee Created Successfully",
            message:
              response.payload?.message ||
              "Employee has been created successfully.",
            description: "The employee has been added to the employee list.",
            onCloseCb: () => {
              resetForm();

              // Close parent Add Employee modal
              onSuccess?.(response);
            },
          });

          return;
        }
      }

      if (!response) return;

      // ==========================================
      // SUCCESS
      // ==========================================
      if (response.meta.requestStatus === "fulfilled") {
        // -------------------------------
        // SIGNUP SUCCESS
        // -------------------------------
        if (endpoint === "/user/signup") {
          showModalRef.current({
            variant: "success",
            title: response.payload?.title || "Registration Successful",
            message:
              response.payload?.message || "Account created successfully.",
            description: "Please log in with your credentials.",
            onCloseCb: () => {
              resetForm();
            },
          });

          return;
        }

        // -------------------------------
        // LOGIN SUCCESS
        // -------------------------------
        if (endpoint === "/user/login" || endpoint === "/admin/login") {
          showModalRef.current({
            variant: "success",
            title: response.payload?.title || "Login Successful",
            message:
              response.payload?.message || "You have logged in successfully.",
            description:
              endpoint === "/admin/login"
                ? "Welcome back to the Admin Dashboard!"
                : "Welcome back to TimeWise!",
            onCloseCb: () => {
              resetForm();

              if (endpoint === "/admin/login") {
                navigate("/adminDashboard");
              } else {
                navigate("/");
              }
            },
          });

          return;
        }
      }

      // ==========================================
      // ERROR
      // ==========================================
      // const errorData = response.payload || {};

      // showModalRef.current({
      //   variant: "error",
      //   title:
      //     errorData?.title ||
      //     (endpoint === "/user/signup"
      //       ? "Registration Failed"
      //       : "Login Failed"),
      //   message: errorData?.message || "An unexpected error occurred.",
      //   reason: errorData?.reason || "Please check your details and try again.",
      // });

      const errorData = response.payload || {};

      let errorTitle = "Request Failed";

      if (endpoint === "/user/signup") {
        errorTitle = "Registration Failed";
      } else if (endpoint === "/user/login") {
        errorTitle = "Login Failed";
      } else if (endpoint === "/admin/login") {
        errorTitle = "Admin Login Failed";
      } else if (endpoint === "/admin/employees") {
        errorTitle = "Employee Creation Failed";
      }

      showModalRef.current({
        variant: "error",
        title: errorData?.title || errorTitle,
        message: errorData?.message || "An unexpected error occurred.",
        reason: errorData?.reason || "Please check your details and try again.",
      });

      setErrors({});
      // } catch (error) {
      //   console.error("Form submission error:", error);

      //   showModalRef.current({
      //     variant: "error",
      //     title:
      //       endpoint === "/user/signup" ? "Registration Failed" : "Login Failed",
      //     message: error?.message || "An unexpected error occurred.",
      //     reason: "Please check your connection and try again.",
      //   });
      // }
    } catch (error) {
      console.error("Form submission error:", error);

      let errorTitle = "Request Failed";

      if (endpoint === "/user/signup") {
        errorTitle = "Registration Failed";
      } else if (endpoint === "/user/login") {
        errorTitle = "Login Failed";
      } else if (endpoint === "/admin/login") {
        errorTitle = "Admin Login Failed";
      } else if (endpoint === "/admin/employees") {
        errorTitle = "Employee Creation Failed";
      }

      showModalRef.current({
        variant: "error",
        title: errorTitle,
        message: error?.message || "An unexpected error occurred.",
        reason: "Please check your connection and try again.",
      });
    }
  };

  // Password field type
  const getInputType = (field) => {
    if (field.type === "password") {
      return showPassword[field.name] ? "text" : "password";
    }

    return field.type;
  };

  /*
   * If fields change dynamically,
   * make sure newly added fields are also added to form state.
   */
  React.useEffect(() => {
    setForm((prev) => {
      const updatedForm = { ...prev };

      fields.forEach((field) => {
        if (!(field.name in updatedForm)) {
          updatedForm[field.name] = "";
        }
      });

      return updatedForm;
    });
  }, [fields]);

  return (
    <>
      <motion.form
        className="form"
        onSubmit={handleSubmit}
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
      >
        {fields.map((el, index) => {
          const fieldError = errors?.[el.name];

          /*
           * =========================
           * CUSTOM SELECT
           * =========================
           */
          if (el.type === "select") {
            const isOpen = openSelect === el.name;

            return (
              <motion.div
                className={`input-box select-box ${
                  fieldError ? "error-active" : ""
                }`}
                key={el.id || el.name}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <button
                  type="button"
                  className={`select-trigger ${isOpen ? "select-open" : ""}`}
                  onClick={() => setOpenSelect(isOpen ? null : el.name)}
                >
                  <span>{form[el.name] || el.name}</span>
                  <span className="select-arrow">{isOpen ? "▲" : "▼"}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="select-options"
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                    >
                      {(el.options || []).map((option) => (
                        <button
                          type="button"
                          className="select-option"
                          key={option}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              [el.name]: option,
                            }));

                            setErrors((prev) => ({
                              ...prev,
                              [el.name]: "",
                            }));

                            setOpenSelect(null);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {fieldError && (
                    <motion.p
                      className="error"
                      initial={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        y: -5,
                      }}
                    >
                      {fieldError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          }

          /*
           * =========================
           * NORMAL INPUT
           * =========================
           */
          return (
            <motion.div
              className={`input-box ${
                el.type === "password" ? "password-box" : ""
              } ${fieldError ? "error-active" : ""}`}
              key={el.id || el.name}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <input
                id={el.name}
                type={getInputType(el)}
                name={el.name}
                placeholder=""
                value={form[el.name] || ""}
                onChange={handleChange}
                autoComplete={el.autoComplete || "off"}
                required={el.required || false}
              />

              <label htmlFor={el.name}>{el.name}</label>

              {el.type === "password" && (
                <motion.span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword((prev) => ({
                      ...prev,
                      [el.name]: !prev[el.name],
                    }))
                  }
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.15 }}
                >
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                  >
                    {showPassword[el.name] ? (
                      <motion.span
                        key="eye"
                        initial={{
                          opacity: 0,
                          rotate: 20,
                        }}
                        animate={{
                          opacity: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          rotate: -20,
                        }}
                      >
                        <FaEye />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="eye-slash"
                        initial={{
                          opacity: 0,
                          rotate: -20,
                        }}
                        animate={{
                          opacity: 1,
                          rotate: 0,
                        }}
                        exit={{
                          opacity: 0,
                          rotate: 20,
                        }}
                      >
                        <FaEyeSlash />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
              )}

              <AnimatePresence mode="wait">
                {fieldError && (
                  <motion.p
                    className="error"
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: -5,
                    }}
                  >
                    {fieldError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        <motion.button
          type="submit"
          className="loginsumit"
          disabled={isloading}
          whileHover={{
            y: -2,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          {isloading ? "Loading..." : button}
        </motion.button>
      </motion.form>

      <Modal
        onReady={(showModal) => {
          showModalRef.current = showModal;
        }}
      />
    </>
  );
};
