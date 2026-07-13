import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authService } from "../services/authService";
import "../styles/Login.css";

const SignUpPage = () => {
  const [isRegister, setIsRegister] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

const validateLogin = () => {
  let newErrors = {};
  let isValid = true;

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

    // Username
    if (!formData.username.trim()) {
      newErrors.username = "Name is required";
      isValid = false;
    } else if (!/^[A-Za-z ]{2,50}$/.test(formData.username)) {
      newErrors.username = "Name should be 2-50 letters";
      isValid = false;
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(formData.password)
    ) {
      newErrors.password =
  "Minimum 8 characters with uppercase, lowercase, number and special character";
      isValid = false;
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    // DOB
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    }

    // Gender
    if (!formData.gender) {
      newErrors.gender = "Please select gender";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    if (isRegister) {
      if (!validateSignup()) {
        setLoading(false);
        return;
      }

      const { data } = await authService.signup(formData);

      console.log(data);

      alert(data.message || "Registration Successful");

      setIsRegister(false);
    } else {
      if (!validateLogin()) {
        setLoading(false);
        return;
      }

      const { data } = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log(data);

      // Save JWT Token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      alert(data.message || "Login Successful");
    }

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      gender: "",
    });

    setErrors({});
  } catch (error) {
    console.error(error);

    alert(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

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
                onClick={() =>
                  setShowLoginPassword(!showLoginPassword)
                }
              >
                {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button type="submit" className="loginsumit" disabled={loading}>{loading ? "Please wait..." : "Login"}</button>

            <p className="message">
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setIsRegister(true);
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    dob: "",
                    gender: "",
                  });
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
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />

              <p className="error">{errors.username}</p>
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
                onClick={() =>
                  setShowRegisterPassword(!showRegisterPassword)
                }
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
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <p className="error">{errors.gender}</p>
            </div>

            <button type="submit" className="loginsumit" disabled={loading}>  {loading ? "Please wait..." : "Register"}</button>

            <p className="message">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setIsRegister(false);
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    dob: "",
                    gender: "",
                  });
                }}
              >
                Sign In
              </span>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  </div>
);
};

export default SignUpPage;