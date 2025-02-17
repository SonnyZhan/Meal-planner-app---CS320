import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

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
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-section">
        <div className="profile-picture">
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="Default Profile"
          />
        </div>

        <div className="user-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      <div className="preferences-section">
        <h3>Allergens</h3>
        <ul className="list">
          {allergens.length > 0 ? (
            allergens.map((allergen, index) => (
              <li key={index} className="list-item">
                {allergen}
              </li>
            ))
          ) : (
            <p>No allergens added.</p>
          )}
        </ul>

        <h3>Dietary Restrictions</h3>
        <ul className="list">
          {dietaryRestrictions.length > 0 ? (
            dietaryRestrictions.map((restriction, index) => (
              <li key={index} className="list-item">
                {restriction}
              </li>
            ))
          ) : (
            <p>No dietary restrictions added.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
