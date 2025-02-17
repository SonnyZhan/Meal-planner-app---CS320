import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-bar">
      <button onClick={() => navigate('/allergy-filter')} className="nav-button">
        Allergy Filter
      </button>
      <button onClick={() => navigate('/search-food')} className="nav-button">
        Search Food
      </button>
      <button onClick={() => navigate('/meal-planner')} className="nav-button">
        Meal Planner
      </button>
      <button onClick={() => navigate('/profile')} className="nav-button profile-button">
        Profile
      </button>
    </div>
  );
};

export default NavigationBar;
