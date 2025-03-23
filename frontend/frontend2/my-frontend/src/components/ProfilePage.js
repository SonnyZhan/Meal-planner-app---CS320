import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";
import NutritionalTracking from "./NutritionalTracking";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [allergens, setAllergens] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);

  useEffect(() => {
    fetchUserInfo();
    fetchUserPreferences();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user_info/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user_preferences/",
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );

      setAllergens(response.data.allergens);
      setDietaryRestrictions(response.data.dietary_restrictions);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  return (
    <div className="container">
      <div className="card profile-card">
        <div className="card-content">
          <div className="profile-header">
            <div className="profile-picture">
              <img
                src="https://www.w3schools.com/howto/img_avatar.png"
                alt="Default Profile"
              />
              <div className="profile-status">Active</div>
            </div>
            <div className="user-info">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-sections">
            <div className="profile-section">
              <div className="section-header">
                <h3>Allergens</h3>
                <span className="section-count">{allergens.length}</span>
              </div>
              <div className="section-content">
                {allergens.length > 0 ? (
                  <ul className="preferences-list">
                    {allergens.map((allergen, index) => (
                      <li key={index} className="preference-item">
                        <span className="preference-icon">⚠️</span>
                        <span className="preference-text">{allergen}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state">No allergens added.</p>
                )}
              </div>
            </div>

            <div className="profile-section">
              <div className="section-header">
                <h3>Dietary Restrictions</h3>
                <span className="section-count">
                  {dietaryRestrictions.length}
                </span>
              </div>
              <div className="section-content">
                {dietaryRestrictions.length > 0 ? (
                  <ul className="preferences-list">
                    {dietaryRestrictions.map((restriction, index) => (
                      <li key={index} className="preference-item">
                        <span className="preference-icon">🍽️</span>
                        <span className="preference-text">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-state">No dietary restrictions added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NutritionalTracking />
    </div>
  );
};

export default ProfilePage;
