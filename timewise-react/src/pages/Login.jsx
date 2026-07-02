import { useState } from "react";
import "../styles/Login.css";

const SignUpPage = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* ================= Sign Up Form ================= */}
      <div className="sign-up">
        <form>
          <div className="content_input">
            <input
              type="text"
              id="signup-name"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="signup-name">Full Name</label>
          </div>

          <div className="content_input">
            <input
              type="email"
              id="signup-email"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="signup-email">Email</label>
          </div>

          <div className="content_input">
            <input
              type="password"
              id="signup-password"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="signup-password">Password</label>
          </div>

          <div className="content_input">
            <input
              type="password"
              id="signup-confirm-password"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="signup-confirm-password">
              Confirm Password
            </label>
          </div>

          <div className="content_input">
            <input type="date" className="form_input_1" />
          </div>

          <div className="content_input">
            <select>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* ================= Login Form ================= */}
      <div className="sign-in">
        <form>
          <h1 className="sign_in">Login</h1>

          <span>or use email password</span>

          <div className="content_input">
            <input
              type="email"
              id="login-email"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="login-email">Email</label>
          </div>

          <div className="content_input">
            <input
              type="password"
              id="login-password"
              className="form_input"
              placeholder=""
            />
            <label htmlFor="login-password">Password</label>
          </div>

          <a href="#">Forgot password?</a>

          <button type="submit">Login</button>
        </form>
      </div>

      {/* ================= Toggle Panel ================= */}
      <div className="toogle-container">
        <div className="toogle">

          <div className="toogle-panel toogle-left">
            <h1>Welcome Back!</h1>
            <p>Log in to access your account</p>

            <button
              type="button"
              className="hidden"
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>

          <div className="toogle-panel toogle-right">
            <h1>Hello, Friend!</h1>
            <p>Register to start your journey with us</p>

            <button
              type="button"
              className="hidden"
              onClick={() => setIsActive(true)}
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SignUpPage;