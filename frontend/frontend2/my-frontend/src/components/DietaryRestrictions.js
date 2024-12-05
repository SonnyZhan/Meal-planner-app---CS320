import React, { useState } from "react";
import axios from "axios";
import "./DietaryRestrictions.css";

const DietaryRestrictions = () => {
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);

  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten Free", "Dairy Free", "Nut Allergy", "Halal", "Kosher"];

  const handleCheckboxChange = (option) => {
    if (selectedRestrictions.includes(option)) {
      setSelectedRestrictions(selectedRestrictions.filter((item) => item !== option));
    } else {
      setSelectedRestrictions([...selectedRestrictions, option]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/dietary-restrictions/", {
        restrictions: selectedRestrictions,
      });
      console.log("Submission successful:", response.data);
    } catch (error) {
      console.error("Error submitting dietary restrictions:", error);
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
                onChange={() => handleCheckboxChange(option)}
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

// hi