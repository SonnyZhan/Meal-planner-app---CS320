import { useState } from "react";
import "./Switch.css"; // Import the CSS styles

const Switch = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => setIsToggled(!isToggled);

  return (
    <div className="switch-container">
      <input
        type="checkbox"
        className="switch-input"
        id="customSwitch"
        checked={isToggled}
        onChange={handleToggle}
      />
      <label className="switch-label" htmlFor="customSwitch">
        <span className="switch-button"></span>
      </label>
    </div>
  );
};

export default Switch;
