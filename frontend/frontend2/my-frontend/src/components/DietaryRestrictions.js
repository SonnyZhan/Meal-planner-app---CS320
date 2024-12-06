import React, { useState } from "react";
import axios from "axios";
import "./DietaryRestrictions.css";

const DietaryRestrictions = () => {
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

  const dietaryOptions = [
    "Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Halal", "Kosher"
  ];

  const allergenOptions = [
    "Nut Allergy", "Shellfish Allergy", "Dairy Allergy", "Egg Allergy", "Peanut Allergy"
  ];

  // Handle change for dietary restrictions checkboxes
  const handleRestrictionChange = (option) => {
    if (selectedRestrictions.includes(option)) {
      setSelectedRestrictions(selectedRestrictions.filter((item) => item !== option));
    } else {
      setSelectedRestrictions([...selectedRestrictions, option]);
    }
  };

  // Handle change for allergen checkboxes
  const handleAllergenChange = (option) => {
    if (selectedAllergens.includes(option)) {
      setSelectedAllergens(selectedAllergens.filter((item) => item !== option));
    } else {
      setSelectedAllergens([...selectedAllergens, option]);
    }
  };

  // Handle form submission to send the dietary restrictions and allergens to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // Get the token from localStorage
    if (!token) {
      console.error("User not authenticated");
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
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      console.log("Allergens and Dietary Restrictions updated successfully:", response.data);
    } catch (error) {
      console.error("Error submitting dietary restrictions and allergens:", error);
    }
  };
  

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="form-title">Select Your Dietary Restrictions</h2>
        <div className="checkbox-container">
          {dietaryOptions.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={selectedRestrictions.includes(option)}
                onChange={() => handleRestrictionChange(option)}
                className="checkbox"
              />
              {option}
            </label>
          ))}
        </div>

        <h2 className="form-title">Select Your Allergens</h2>
        <div className="checkbox-container">
          {allergenOptions.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={selectedAllergens.includes(option)}
                onChange={() => handleAllergenChange(option)}
                className="checkbox"
              />
              {option}
            </label>
          ))}
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DietaryRestrictions;
