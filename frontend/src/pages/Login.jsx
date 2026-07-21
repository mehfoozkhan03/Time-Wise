import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../services/authService";
import "../styles/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Feedback } from "./FeedBack";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  dob: "",
  gender: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const nameRegex = /^[A-Za-z ]{2,50}$/;

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError } = useSelector((store) => store.auth);

  const [isRegister, setIsRegister] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [modal, setModal] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
    reason: "", // ← specific error detail
    onCloseCb: null,
  });

  const showModal = (
    type,
    title,
    message,
    reasonOrCb = null,
    onCloseCb = null,
  ) => {
  
    const isCallback = typeof reasonOrCb === "function";
    setModal({
      open: true,
      type,
      title,
      message,
      reason: isCallback ? "" : reasonOrCb || "",
      onCloseCb: isCallback ? reasonOrCb : onCloseCb,
    });
  };

  const closeModal = () => {
    const cb = modal.onCloseCb;
    setModal({
      open: false,
      type: "",
      title: "",
      message: "",
      reason: "",
      onCloseCb: null,
    });
    if (cb) cb();
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Validation ────────────────────────────────────────────────────────────────

  const validateLogin = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateSignup = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "First name should be 2-50 letters";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name should be 2-50 letters";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Minimum 8 characters with uppercase, lowercase, number and special character";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = isRegister ? validateSignup() : validateLogin();
    if (!isValid) return;

    try {
      if (isRegister) {
        const result = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(result)) {
          resetForm();
          setIsRegister(false);
          showModal(
            "success",
            "Registration Successful",
            "Your account has been created successfully.",
          );
        } else {
          // Pass the server error as `reason`
          showModal(
            "error",
            "Registration Failed",
            "We could not create your account.",
            result.payload || "An unexpected error occurred.",
          );
        }
      } else {
        const result = await dispatch(
          loginUser({ email: formData.email, password: formData.password }),
        );

        if (loginUser.fulfilled.match(result)) {
          resetForm();
          showModal(
            "success",
            "Login Successful",
            result.payload.message || "Welcome back!",
            () => navigate("/"),
          );
        } else {
          // Pass the server error (e.g. "Invalid password") as `reason`
          showModal(
            "error",
            "Login Failed",
            "We could not sign you in.",
            result.payload || "Invalid email or password.",
          );
        }
      }
    } catch (error) {
      console.error(error);
      showModal(
        "error",
        "Oops!",
        "Something went wrong on our end.",
        error.message || "Please try again later.",
      );
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="sing_login">
      <div className="login-page">
        <AnimatePresence mode="wait">
          {!isRegister ? (
            <motion.form
              key="login"
              onSubmit={handleSubmit}
              className="login-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2>Login</h2>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <p className="error">{errors.email}</p>
              </div>

              <div className="input-box password-box">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <p className="error">{errors.password}</p>
                <span
                  className="eye-icon"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button type="submit" className="loginsumit" disabled={isLoading}>
                {isLoading ? "Please wait..." : "Login"}
              </button>

              <p className="message">
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setIsRegister(true);
                    resetForm();
                  }}
                >
                  Register now
                </span>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              onSubmit={handleSubmit}
              className="register-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2>New Registration</h2>

              <div className="input-box">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
                <p className="error">{errors.firstName}</p>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
                <p className="error">{errors.lastName}</p>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
                <p className="error">{errors.email}</p>
              </div>

              <div className="input-box password-box">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <p className="error">{errors.password}</p>
                <span
                  className="eye-icon"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="input-box password-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <p className="error">{errors.confirmPassword}</p>
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="input-box">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                <p className="error">{errors.dob}</p>
              </div>

              <div className="input-box">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="error">{errors.gender}</p>
              </div>

              <button type="submit" className="loginsumit" disabled={isLoading}>
                {isLoading ? "Please wait..." : "Register"}
              </button>

              <p className="message">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsRegister(false);
                    resetForm();
                  }}
                >
                  {" "}
                  Sign In{" "}
                </span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Feedback
        isOpen={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        reason={modal.reason}
        onClose={closeModal}
      />
    </div>
  );
};

export default SignUpPage;
