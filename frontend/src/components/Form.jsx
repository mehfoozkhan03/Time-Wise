import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"

import { validateForm } from '../utils/validation';
import { Modal } from "../components/Modal/Modal"
import { registerUser, loginUser } from "../store/authSlice"
import { loginAdmin } from "../store/adminAuthSlice"
import '../styles/Form.css';

export const Form = ({
  fields = [],
  button = 'Submit',
  endpoint
}) => {

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const showModalRef = React.useRef()

  // here we have to set our field
  const [form, setForm] = React.useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {});
  });


  const { isloading, isError, isAuthenticated, errorMessage } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState({}); // temp using this this is comming from validator function and it will handle all validation form the only 

  // 👇 DEFINE IT HERE
  const resetForm = () => {
    setForm(
      fields.reduce((acc, field) => {
        acc[field.name] = '';
        return acc;
      }, {})
    );

    setErrors({});
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const validationErrors = validateForm(form, fields);

    setErrors(validationErrors);

    try {

      let response;

      // response for registration
      if (endpoint === "/user/signup") {
        response = await dispatch(registerUser(form))
        console.log("🚀 ~ handleSubmit ~ response:", response)
      }

      // response for login

      if (endpoint === "/user/login") {
        response = await dispatch(loginUser(form))
        console.log("🚀 ~ handleSubmit ~ response:", response)
      }

      // respones for adminLogin

      if (endpoint === "/admin/login") {
        response = await dispatch(loginAdmin(form))
        console.log("🚀 ~ handleSubmit ~ response:", response)

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

            title:
              response.payload?.title ||
              "Registration Successful",

            message:
              response.payload?.message ||
              "Account created successfully.",

            description:
              "Please log in with your credentials.",

            onCloseCb: () => {
              resetForm();
            },
          });

          return;
        }

        // -------------------------------
        // LOGIN SUCCESS
        // -------------------------------

        if (
          endpoint === "/user/login" ||
          endpoint === "/admin/login"
        ) {
          showModalRef.current({
            variant: "success",

            title:
              response.payload?.title ||
              "Login Successful",

            message:
              response.payload?.message ||
              "You have logged in successfully.",

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

      const errorData = response.payload || {};

      showModalRef.current({
        variant: "error",

        title:
          errorData?.title ||
          (endpoint === "/user/signup"
            ? "Registration Failed"
            : "Login Failed"),

        message:
          errorData?.message ||
          "An unexpected error occurred.",

        reason:
          errorData?.reason ||
          "Please check your details and try again.",
      });



      /*
       * Reset form after successful request
       */
      setForm(
        fields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {}),
      );

      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);

      showModalRef.current({
        variant: "error",

        title:
          endpoint === "/user/signup"
            ? "Registration Failed"
            : "Login Failed",

        message:
          error?.message ||
          "An unexpected error occurred.",

        reason:
          "Please check your connection and try again.",
      });
    }
  };

  /*
   * Password field
   */
  const getInputType = (field) => {
    if (field.type === 'password') {
      return showPassword ? 'text' : 'password';
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
          updatedForm[field.name] = '';
        }
      });
      console.log(`🚀 ~ fields:`, fields);

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
          ease: 'easeOut',
        }}
      >
        {fields.map((el, index) => {
          const fieldError = errors?.[el.name];
          console.log(`🚀 ~ fieldError:`, fieldError);

          /*
           * =========================
           * GENDER
           * =========================
           */
          if (el.name === 'gender') {
            return (
              <motion.div
                className="input-box"
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
                <label className="gender-title">{el.name}</label>

                <div className="gender">
                  {Object.entries(el.typeOfGender || {}).map(([key, value]) => {
                    const inputId = `${el.name}-${key}`;

                    return (
                      <div className="gender-option" key={key}>
                        <input
                          id={inputId}
                          name={el.name}
                          type={value.type}
                          value={key}
                          checked={form[el.name] === key}
                          onChange={handleChange}
                        />

                        <label htmlFor={inputId}>{key}</label>
                      </div>
                    );
                  })}
                </div>

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
                        height: 'auto',
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
              className={`input-box ${el.type === 'password' ? 'password-box' : ''
                } ${fieldError ? 'error-active' : ''}`}
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
                value={form[el.name] || ''}
                onChange={handleChange}
                autoComplete={el.autoComplete || 'off'}
                required={el.required || false}
              />

              <label htmlFor={el.name}>{el.name}</label>

              {el.type === 'password' && (
                <motion.span
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.15 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {showPassword ? (
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
                    ) : (
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
                      height: 'auto',
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
          {isloading ? 'Loading...' : button}
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
