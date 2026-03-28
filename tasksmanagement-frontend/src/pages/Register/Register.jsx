import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
  let newErrors = {};

  if (!name.trim()) newErrors.name = "Name is required";
  if (!email.trim()) newErrors.email = "Email is required";

  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  return newErrors;
};

  const handleRegister = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          passwordHash: password
        })
      });

      if (response.ok) {
        alert("User Registered Successfully");
        window.location.href = "/login";
      } else {
        
        const message = await response.text();
        setErrors({ general: message });
      }

    } catch (error) {
      setErrors({ general: "Server error. Try again." });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="register-error">{errors.name}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="register-error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="register-error">{errors.password}</p>}

        {errors.general && (
          <p className="register-error">{errors.general}</p>
        )}

        <button onClick={handleRegister}>Register</button>

        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;