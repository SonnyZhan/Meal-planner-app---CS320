import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Define the API endpoint based on login/register
    const url = isLogin
      ? "http://localhost:8000/api/login/"
      : "http://localhost:8000/api/register/";

    // Prepare the payload
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      // Make the API request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"), // CSRF token for Django
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        if (isLogin) {
          // Save the token to localStorage
          const data = await response.json();
          localStorage.setItem("token", data.token); // Assuming `data.token` contains the token
          onLogin(data); // Trigger login success
          navigate("/allergy-filter"); // Redirect to next page
        } else {
          showToast("Registration Successful", "success");
        }
      } else {
        // Handle API errors
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
        showToast(errorData.message || "An error occurred", "error");
      }
    } catch (err) {
      // Handle request errors
      setError("An error occurred while submitting the form");
      showToast("An error occurred while submitting the form", "error");
    }
  };

  // Helper to get CSRF token from cookies
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  // Helper to show toast notifications
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <h2 className="card-title">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              {!isLogin && (
                <div className="form-control">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="input-field"
                    required
                  />
                </div>
              )}

              <div className="form-control">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>

              <div className="form-control">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isLogin ? "Enter your password" : "Create a password"
                  }
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
          </form>

          <div className="switch-container">
            <span>Login</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={!isLogin}
                onChange={() => setIsLogin(!isLogin)}
              />
              <span className="slider"></span>
            </label>
            <span>Register</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
