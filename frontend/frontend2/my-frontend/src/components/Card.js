import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "./Switch";
import axios from "axios";

const Card = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login_user/",
          {
            email,  
            password,
          }
        );
        alert("Login successful!");
        onLogin(response.data.token); // Save token for authentication
        navigate("/allergy-filter");
      } catch (error) {
        console.error("Login failed:", error.response?.data);
        alert(error.response?.data?.error || "Invalid email or password");
      }
    } else {
      // Registration
      try {
        const response = await axios.post(
          "http://localhost:8000/api/register_user/",
          {
            username,
            email,
            password,
          }
        );
        alert("Registration successful!");
        setIsLogin(true); // Switch to login form after successful registration
      } catch (error) {
        console.error("Registration failed:", error.response?.data);
        alert(
          error.response?.data?.error ||
            "Registration failed. Please try again."
        );
      }
    }
  };

  const renderLoginForm = () => (
    <>
      <div>Login</div>
      <label className="form-label" htmlFor="InputUsername">
        Username:
      </label>
      <input
        type="text"
        className="form-control"
        id="InputUsername"
        placeholder="Enter your username"
        style={inputStyle}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-label" htmlFor="InputPassword1">
        Password:
      </label>
      <input
        type="password"
        className="form-control"
        id="InputPassword1"
        placeholder="Enter your password"
        style={inputStyle}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div>Register</div>
      <label className="form-label" htmlFor="InputUsername">
        Username:
      </label>
      <input
        type="text"
        className="form-control"
        id="InputUsername"
        placeholder="Enter your username"
        style={inputStyle}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="form-label" htmlFor="InputEmail">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="InputEmail"
        placeholder="Enter your email"
        style={inputStyle}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className="form-label" htmlFor="InputPassword2">
        Password:
      </label>
      <input
        type="password"
        className="form-control"
        id="InputPassword2"
        placeholder="Create a password"
        style={inputStyle}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </>
  );

  return (
    <div style={containerStyle}>
      <form className="card" style={formStyle} onSubmit={handleSubmit}>
        <div className="card-body">
          {isLogin ? renderLoginForm() : renderRegisterForm()}
        </div>
        <button type="submit" className="btn btn-primary" style={buttonStyle}>
          Submit
        </button>
        <Switch isToggled={!isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </form>
    </div>
  );
};

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
