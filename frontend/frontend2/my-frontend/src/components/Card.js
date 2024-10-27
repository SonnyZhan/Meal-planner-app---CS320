import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Switch from "./Switch";

const Card = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const navigate = useNavigate();  
  const handleSubmit = (e) => {

    e.preventDefault(); 
    if (isLogin) {
      navigate("/main");
    } else {
      console.log("Login Submitted");
    }
  };

  const renderLoginForm = () => (
    <>
      <div>Login</div>
      <label className="form-label" htmlFor="InputEmail1">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="InputEmail1"
        placeholder="Enter your email"
        style={inputStyle}
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
      />
    </>
  );

  const renderRegisterForm = () => (
    <>
      <div>Register</div>
      <label className="form-label" htmlFor="InputName">
        Name:
      </label>
      <input
        type="text"
        className="form-control"
        id="InputName"
        placeholder="Enter your name"
        style={inputStyle}
      />
      <label className="form-label" htmlFor="InputEmail2">
        Email:
      </label>
      <input
        type="email"
        className="form-control"
        id="InputEmail2"
        placeholder="Enter your email"
        style={inputStyle}
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
