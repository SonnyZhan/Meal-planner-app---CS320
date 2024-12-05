import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "./Switch";

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
      : { name: formData.name, email: formData.email, password: formData.password };

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
        const data = await response.json();
        if (isLogin) {
          onLogin(data); // Trigger login success
          navigate("/allergy-filter"); // Redirect to next page
        } else {
          alert("Registration Successful");
        }
      } else {
        // Handle API errors
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
      }
    } catch (err) {
      // Handle request errors
      setError("An error occurred while submitting the form");
    }
  };

  // Helper to get CSRF token from cookies
  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };

  // Render login form
  const renderLoginForm = () => (
    <>
      <div>Login</div>
      <label className="form-label" htmlFor="email">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="Enter your email"
        style={inputStyle}
        value={formData.email}
        onChange={handleChange}
      />
      <label className="form-label" htmlFor="password">
        Password:
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        placeholder="Enter your password"
        style={inputStyle}
        value={formData.password}
        onChange={handleChange}
      />
    </>
  );

  // Render register form
  const renderRegisterForm = () => (
    <>
      <div>Register</div>
      <label className="form-label" htmlFor="name">
        Name:
      </label>
      <input
        type="text"
        className="form-control"
        id="name"
        placeholder="Enter your name"
        style={inputStyle}
        value={formData.name}
        onChange={handleChange}
      />
      <label className="form-label" htmlFor="email">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="Enter your email"
        style={inputStyle}
        value={formData.email}
        onChange={handleChange}
      />
      <label className="form-label" htmlFor="password">
        Password:
      </label>
      <input
        type="password"
        className="form-control"
        id="password"
        placeholder="Create a password"
        style={inputStyle}
        value={formData.password}
        onChange={handleChange}
      />
    </>
  );

  return (
    <div style={containerStyle}>
      <form className="card" style={formStyle} onSubmit={handleSubmit}>
        <div className="card-body">
          {isLogin ? renderLoginForm() : renderRegisterForm()}
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit" className="btn btn-primary" style={buttonStyle}>
          Submit
        </button>
        <Switch isToggled={!isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </form>
    </div>
  );
};

// Styling for the card and inputs
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#FFA500",
};

const formStyle = {
  width: "400px",
  height: "500px",
  padding: "20px",
  backgroundColor: "#FF6347",
  borderRadius: "15px",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  borderRadius: "5px",
  padding: "10px",
  display: "flex",
  width: "300px",
  marginBottom: "10%",
};

const buttonStyle = {
  width: "25%",
  height: "10%",
  borderRadius: "5px",
  marginTop: "10%",
  alignContent: "center",
};

export default Card;
