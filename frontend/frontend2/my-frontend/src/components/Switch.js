import React from "react";
import "./Switch.css"; // Import the CSS styles

const Switch = ({ isToggled, onToggle }) => (
  <div style={{ display: "flex", flexDirection: "row" }}>
    <div className="Login" style={{ marginTop: "20px", fontSize: "14px" }}>
      Login
    </div>
    <div className="switch-container">
      <input
        type="checkbox"
        className="switch-input"
        id="customSwitch"
        checked={isToggled}
        onChange={onToggle}
      />
      <label className="switch-label" htmlFor="customSwitch">
        <span className="switch-button"></span>
      </label>
    </div>
    <div
      className="Register"
      style={{ marginTop: "20px", fontSize: "14px" }}
    >
      Register
    </div>
  </div>
);

export default Switch;
