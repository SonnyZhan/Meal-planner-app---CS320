import React from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Allergy Filter", path: "/allergy-filter" },
    { label: "Search Food", path: "/search-food" },
    { label: "Meal Planner", path: "/meal-planner" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">UMass Meal Planner</div>
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
