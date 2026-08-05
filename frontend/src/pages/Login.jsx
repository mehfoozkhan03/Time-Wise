import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import '../styles/Login.css';
import { authService } from '../services/authService';
import { loginUser, registerUser } from '../store/authSlice';
import { loginAdmin } from '../store/adminAuthSlice';
import { adminAuthService } from '../services/adminAuthService';
import { Feedback } from './FeedBack';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dob: '',
  gender: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
const nameRegex = /^[A-Za-z ]{2,50}$/;

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector(
    (store) => store.auth,
  );

  const [isRegister, setIsRegister] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  //admin login
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [modal, setModal] = useState({
    open: false,
    variant: '',
    title: '',
    message: '',
    description: '',
    reason: '',
    onCloseCb: null,
  });

  const showModal = ({
    variant,
    title,
    message,
    description = '',
    reason = '',
    onCloseCb = null,
  }) => {
    setModal({
      open: true,
      variant,
      title,
      message,
      description,
      reason,
      onCloseCb,
    });
  };

  const closeModal = () => {
    const cb = modal.onCloseCb;
    setModal({
      open: false,
      variant: '',
      description: '',
      message: '',
      reason: '',
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
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Validation ────────────────────────────────────────────────────────────────

  const validateLogin = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateSignup = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name should be 2-50 letters';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = 'Last name should be 2-50 letters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Minimum 8 characters with uppercase, lowercase, number and special character';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // ── Submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = isRegister ? validateSignup() : validateLogin();
    if (!isValid) {
      iziToast.warning({
        position: 'bottomLeft',
        timeout: 3000,
        title: 'Warning',
        message: 'Please fill all fields',
        iconColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim(),
      });
      return;
    }

    try {
      if (isRegister) {
        const result = await dispatch(registerUser(formData));

        if (registerUser.fulfilled.match(result)) {
          resetForm();
          setIsRegister(false);

          iziToast.success({
            position: 'bottomLeft',
            timeout: 3000,
            title: 'Success',
            message: 'Registration Successful',
            iconColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--primary')
              .trim(),
          });

          showModal({
            variant: 'success',
            title: result.payload.title,
            message: result.payload.message,
            description: result.payload.description,
            reason: result.payload.reason,
          });
        } else {
          // Signup error from backend
          iziToast.error({
            position: 'bottomLeft',
            timeout: 3000,
            title: 'Error',
            message: result.payload?.message || 'Registration failed',
            iconColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--primary')
              .trim(),
          });

          showModal({
            variant: 'error',
            title: result.payload?.title || 'Registration Failed',
            message: result.payload?.message || 'An error occurred',
            reason: result.payload?.reason || 'Please try again.',
          });
        }
      } else {
        // User Login / Admin Login
        const result = isAdminLogin
          ? await dispatch(
              loginAdmin({
                email: formData.email,
                password: formData.password,
              }),
            )
          : await dispatch(
              loginUser({
                email: formData.email,
                password: formData.password,
              }),
            );
        console.log(`🚀 ~ result:`, result);

        if (
          loginUser.fulfilled.match(result) ||
          (isAdminLogin && result.payload?.success)
        ) {
          resetForm();

          iziToast.success({
            position: 'bottomLeft',
            timeout: 3000,
            title: 'Success',
            message: 'Login Successful',
            iconColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--primary')
              .trim(),
          });

          showModal({
            variant: 'success',
            title: result.payload?.title || 'Welcome!',
            message: result.payload?.message || 'Login successful',
            description: result.payload?.description,
            reason: result.payload?.reason,
            onCloseCb: () => {
              setTimeout(
                () => navigate(isAdminLogin ? '/adminDashboard' : '/'),
                300,
              );
            },
          });
        } else {
          // Login error from backend
          iziToast.error({
            position: 'bottomLeft',
            timeout: 3000,
            title: 'Error',
            message: result.payload?.message || 'Login failed',
            iconColor: getComputedStyle(document.documentElement)
              .getPropertyValue('--primary')
              .trim(),
          });

          showModal({
            variant: 'error',
            title: result.payload?.title || 'Login Failed',
            message: result.payload?.message || 'An error occurred',
            reason: result.payload?.reason || 'Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);

      // Fallback for unexpected errors
      const errorTitle = isRegister ? 'Registration Failed' : 'Login Failed';
      const errorMessage = error.message || 'An unexpected error occurred';
      const errorReason = 'Please check your connection and try again.';

      iziToast.error({
        position: 'bottomLeft',
        timeout: 3000,
        title: 'Error',
        message: errorMessage,
        iconColor: getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim(),
      });

      showModal({
        variant: 'error',
        title: errorTitle,
        message: errorMessage,
        reason: errorReason,
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="sing_login">
      <div className="login-page">
        <AnimatePresence mode="wait">
          {!isRegister ? (
            <motion.form
              key={isAdminLogin ? 'admin-login' : 'user-login'}
              onSubmit={handleSubmit}
              className="login-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.25 }}
            >
              <h2>{isAdminLogin ? 'ADMIN LOGIN PAGE' : 'Login'}</h2>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Email</label>
                <p className="error">{errors.email}</p>
              </div>

              <div
                className={`input-box password-box ${errors.password ? 'error-active' : ''}`}
              >
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Password</label>
                <p className="error">{errors.password}</p>
                <span
                  className="eye-icon"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button type="submit" className="loginsumit" disabled={isLoading}>
                {isLoading
                  ? 'Please wait...'
                  : isAdminLogin
                    ? 'Admin Login'
                    : 'Login'}
              </button>

              {!isAdminLogin && (
                <p className="message">
                  {' '}
                  Don't have an account?{' '}
                  <span
                    onClick={() => {
                      setIsRegister(true);
                      resetForm();
                    }}
                  >
                    Register now
                  </span>
                </p>
              )}
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
                  placeholder=""
                />
                <label>First Name</label>
                <p className="error">{errors.firstName}</p>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Last Name</label>
                <p className="error">{errors.lastName}</p>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Email</label>
                <p className="error">{errors.email}</p>
              </div>

              <div
                className={`input-box password-box ${errors.password ? 'error-active' : ''}`}
              >
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Password</label>
                <p className="error">{errors.password}</p>
                <span
                  className="eye-icon"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div
                className={`input-box password-box ${errors.confirmPassword ? 'error-active' : ''}`}
              >
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=""
                />
                <label>Confirm Password</label>
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
                {isLoading ? 'Please wait...' : 'Register'}
              </button>

              <p className="message">
                Already have an account?{' '}
                <span
                  onClick={() => {
                    setIsRegister(false);
                    resetForm();
                  }}
                >
                  {' '}
                  Sign In{' '}
                </span>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <Feedback
        isOpen={modal.open}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        reason={modal.reason}
        description={modal.description}
        onClose={closeModal}
      />
    </div>
  );
};

export default SignUpPage;
