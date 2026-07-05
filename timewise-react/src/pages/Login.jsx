import { useState } from "react";
import "../styles/Login.css";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpPage = () => {
 const [isRegister, setIsRegister] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      alert("Registration Form Submitted");
    } else {
      alert("Login Form Submitted");
    }
  };

  return (
    <section>
    <div className="login-page">
      <AnimatePresence mode="wait">
        {!isRegister ? (
          <motion.form
            onSubmit={handleSubmit}
            key="login"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            className="login-form"
          >
            <h2>Login</h2>

            <div className="input-box">
              <input type="text" placeholder="Username" required />
            </div>

            <div className="input-box password-box">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowLoginPassword(!showLoginPassword)
                }
              >
                {showLoginPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </span>
            </div>

            <button type="submit">Login</button>

            <p className="message">
              Don't have an account?{" "}
              <span onClick={() => setIsRegister(true)}>
                Register now
              </span>
            </p>
          </motion.form>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            key="register"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            className="register-form"
          >
            <h2>New Registration</h2>

            <div className="input-box">
              <input type="text" placeholder="Username" required />
            </div>

            <div className="input-box">
              <input type="email" placeholder="Email" required />
            </div>

            <div className="input-box password-box">
              <input
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowRegisterPassword(
                    !showRegisterPassword
                  )
                }
              >
                {showRegisterPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </span>
            </div>

            <div className="input-box password-box">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                required
              />

              <span
                className="eye-icon"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </span>
            </div>

            <div className="input-box">
              <input type="date"  placeholder="dd-mm-yy" required />
            </div>

            <div className="input-box">
            <select required defaultValue="">
            <option value="" disabled>  Select Gender
</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>
          

            <button type="submit">Register</button>

            <p className="message">
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>
                Sign In
              </span>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
    </section>
  );
};

export default SignUpPage;