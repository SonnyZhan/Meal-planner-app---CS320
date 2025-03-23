import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";
import NutritionalTracking from "./NutritionalTracking";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerColor, setHeaderColor] = useState("#6366f1"); // Default color
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedProfilePic, setSelectedProfilePic] = useState(1); // Default to profile1
  const [showProfilePicPicker, setShowProfilePicPicker] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        const [userInfoResponse, preferencesResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/user_info/", {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get("http://localhost:8000/api/user_preferences/", {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setUserInfo(userInfoResponse.data);
        setUserPreferences(preferencesResponse.data);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleColorChange = (color) => {
    setHeaderColor(color);
    setShowColorPicker(false);
  };

  const handleProfilePicChange = (picNumber) => {
    setSelectedProfilePic(picNumber);
    setShowProfilePicPicker(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div
        className="profile-header"
        style={{
          background: `linear-gradient(135deg, ${headerColor} 0%, ${adjustColor(
            headerColor,
            -20
          )} 100%)`,
        }}
      >
        <div className="profile-avatar">
          <div
            className="avatar-circle"
            onClick={() => setShowProfilePicPicker(!showProfilePicPicker)}
          >
            <img
              src={`/images/profile${selectedProfilePic}.png`}
              alt="Profile"
              className="profile-image"
            />
          </div>
          {showProfilePicPicker && (
            <div className="profile-pic-picker">
              <div className="profile-pic-options">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    className="profile-pic-option"
                    onClick={() => handleProfilePicChange(num)}
                  >
                    <img
                      src={`/images/profile${num}.png`}
                      alt={`Profile ${num}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userInfo?.name || "User"}</h1>
          <p className="profile-email">
            {userInfo?.email || "email@example.com"}
          </p>
        </div>
        <div className="color-picker-container">
          <button
            className="color-picker-button"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            🎨
          </button>
          {showColorPicker && (
            <div className="color-picker">
              <div className="color-options">
                <button
                  className="color-option"
                  style={{ backgroundColor: "#6366f1" }}
                  onClick={() => handleColorChange("#6366f1")}
                />
                <button
                  className="color-option"
                  style={{ backgroundColor: "#3b82f6" }}
                  onClick={() => handleColorChange("#3b82f6")}
                />
                <button
                  className="color-option"
                  style={{ backgroundColor: "#10b981" }}
                  onClick={() => handleColorChange("#10b981")}
                />
                <button
                  className="color-option"
                  style={{ backgroundColor: "#f59e0b" }}
                  onClick={() => handleColorChange("#f59e0b")}
                />
                <button
                  className="color-option"
                  style={{ backgroundColor: "#ef4444" }}
                  onClick={() => handleColorChange("#ef4444")}
                />
                <button
                  className="color-option"
                  style={{ backgroundColor: "#8b5cf6" }}
                  onClick={() => handleColorChange("#8b5cf6")}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">Dietary Preferences</h2>
          <div className="preferences-grid">
            <div className="preference-card">
              <h3>Allergens</h3>
              <div className="preference-list">
                {userPreferences?.allergens?.length > 0 ? (
                  userPreferences.allergens.map((allergen, index) => (
                    <span key={index} className="preference-tag">
                      {allergen}
                    </span>
                  ))
                ) : (
                  <p className="no-preferences">No allergens specified</p>
                )}
              </div>
            </div>

            <div className="preference-card">
              <h3>Dietary Restrictions</h3>
              <div className="preference-list">
                {userPreferences?.dietary_restrictions?.length > 0 ? (
                  userPreferences.dietary_restrictions.map(
                    (restriction, index) => (
                      <span key={index} className="preference-tag">
                        {restriction}
                      </span>
                    )
                  )
                ) : (
                  <p className="no-preferences">
                    No dietary restrictions specified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Nutritional Overview</h2>
          <div className="nutritional-chart">
            <NutritionalTracking />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/.{2}/g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export default ProfilePage;
