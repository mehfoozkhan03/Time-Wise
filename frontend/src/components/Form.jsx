import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import ApiCall from '../services/api';
import '../styles/Form.css';
import { useSelector } from 'react-redux';

export const Form = ({
  fields = [],
  button = 'Submit',
  endpoint,
  errors = {},
  onSuccess,
}) => {
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

  /*
   * here we have to set model
   *
   *
   *
   */

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await ApiCall.post(endpoint, form);
      console.log('data', response);
      if (onSuccess) {
        onSuccess(response);
      }

      /*
       * Reset form after successful request
       */
      setForm(
        fields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {}),
      );
    } catch (error) {
      console.log('error', error);
      // i have to work on error
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
            className={`input-box ${
              el.type === 'password' ? 'password-box' : ''
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
  );
};
