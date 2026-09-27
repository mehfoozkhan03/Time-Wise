
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import ApiCall from "../services/api";
import "../styles/Form.css";

export const Form = ({
  fields = [],
  button = "Submit",
  endpoint,
  errors = {},
  onSuccess,
}) => {
  const [form, setForm] = React.useState(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  });

  // const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [openSelect, setOpenSelect] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await ApiCall.post(endpoint, form);

      console.log("data", response);

      if (onSuccess) {
        onSuccess(response);
      }

      /*
       * Reset form after successful request
       */
      setForm(
        fields.reduce((acc, field) => {
          acc[field.name] = "";
          return acc;
        }, {}),
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Password field
   */
  const getInputType = (field) => {
    if (field.type === "password") {
      return showPassword[field.name] ? "text" : "password";
    }

    return field.type;
  };

  return (
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
         * GENDER
         * =========================
         */
        if (el.type === "select") {
          const isOpen = openSelect === el.name;

          return (
            <motion.div
              className="input-box select-box"
              key={el.id || el.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
                <span>{el.name}</span>

                <span className="select-arrow">{isOpen ? "▲" : "▼"}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="select-options"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {el.options.map((option) => (
                      <button
                        type="button"
                        className="select-option"
                        key={option}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            [el.name]: option,
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
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
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
                <AnimatePresence mode="wait" initial={false}>
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
        disabled={loading}
        whileHover={{
          y: -2,
        }}
        whileTap={{
          scale: 0.98,
        }}
      >
        {loading ? "Loading..." : button}
      </motion.button>
    </motion.form>
  );
};
