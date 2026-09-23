import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { Form } from "./Form";
import { forms } from "../data/form";

const AuthForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/signup";

  return (
    <div className="sing_login">
      <div className="login-page">
        <AnimatePresence mode="wait">
          {!isRegister ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <h2>Login</h2>

              <Form
                fields={forms.login.fields}
                button={forms.login.button}
                endpoint={forms.login.endpoint}
              />
              <p className="message">
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")}>Register now</span>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <h2>New Registration</h2>

              <Form
                fields={forms.signup.fields}
                button={forms.signup.button}
                endpoint={forms.signup.endpoint}
              />

              <p className="message">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>Sign In</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthForm;
