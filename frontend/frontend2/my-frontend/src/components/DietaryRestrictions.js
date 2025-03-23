import React, { useState } from "react";
import axios from "axios";

const DietaryRestrictions = () => {
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten Free",
    "Dairy Free",
    "Halal",
    "Kosher",
  ];

  const allergenOptions = [
    "Nut Allergy",
    "Shellfish Allergy",
    "Dairy Allergy",
    "Egg Allergy",
    "Peanut Allergy",
  ];

  const handleRestrictionChange = (value) => {
    setSelectedRestrictions((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleAllergenChange = (value) => {
    setSelectedAllergens((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please log in first.", "error");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8000/api/update_allergens_and_restrictions/",
        {
          allergens: selectedAllergens,
          restrictions: selectedRestrictions,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("Your dietary preferences have been updated.", "success");
    } catch (error) {
      showToast(
        error.response?.data?.error ||
          "An error occurred while submitting the data.",
        "error"
      );
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <h2 className="card-title">Dietary Preferences</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="section">
                <h3 className="section-title">Dietary Restrictions</h3>
                <div className="checkbox-group">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedRestrictions.includes(option)}
                        onChange={() => handleRestrictionChange(option)}
                        className="checkbox"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider"></div>

              <div className="section">
                <h3 className="section-title">Allergens</h3>
                <div className="checkbox-group">
                  {allergenOptions.map((option) => (
                    <label key={option} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedAllergens.includes(option)}
                        onChange={() => handleAllergenChange(option)}
                        className="checkbox"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DietaryRestrictions;
