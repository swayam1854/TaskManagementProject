import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          passwordHash: password
        })
      });

      const data = await response.text();

      if (response.ok) {
        localStorage.setItem("token", data);

        
        window.location.href = "/dashboard";
      } else {
        setErrors({ general: "Invalid credentials" });
      }
    } catch (error) {
      setErrors({ general: "Server error. Try again." });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to your account</p>

        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="login-error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="login-error">{errors.password}</p>}

        {errors.general && <p className="login-error">{errors.general}</p>}

        <button onClick={handleLogin}>Login</button>

        <p style={{ marginTop: "15px" }}>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;