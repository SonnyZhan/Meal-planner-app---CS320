import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";
import { useMsal } from "@azure/msal-react";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();

  const navItems = [
    { label: "Allergy Filter", path: "/allergy-filter", icon: "🔍" },
    { label: "Search Food", path: "/search-food", icon: "🍽️" },
    { label: "Meal Planner", path: "/meal-planner", icon: "📅" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ];

  const handleLogout = () => {
    instance.logoutRedirect().then(() => {
      navigate("/");
    });
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">🍽️</span>
          <span className="nav-title">UMass Meal Planner</span>
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
          <button className="nav-link" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
