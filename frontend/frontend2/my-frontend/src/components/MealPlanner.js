// src/components/MealPlanner.js
import React, { useState } from "react";
import axios from "axios";
import "./MealPlanner.css"; 

const TIME_SLOTS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "brunch", label: "Brunch" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "late night", label: "Late Night" },
];

const DINING_HALLS = [
  { value: "worcester", label: "Worcester" },
  { value: "frank", label: "Frank" },
  { value: "berkshire", label: "Berkshire" },
  { value: "hamp", label: "Hamp" },
];

const MealPlanner = () => {
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");
  const [selectedDiningHall, setSelectedDiningHall] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [showPopup, setShowPopup] = useState(false); 

  const handleMealPlannerSubmit = (event) => {
    event.preventDefault();
    setShowPopup(true); //for showing pop up without validation
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddToMealPlan = (mealIndex) => {
    alert(`Meal ${mealIndex + 1} added to meal planner`);
    setShowPopup(false);
  };

  return (
    <div className="meal-planner-container">
      <h2>Search for Meal</h2>
      <form onSubmit={handleMealPlannerSubmit} className="meal-planner-form">
        <div className="form-group">
          <label>Calories:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Proteins (g):</label>
          <input
            type="number"
            value={proteins}
            onChange={(e) => setProteins(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Fats (g):</label>
          <input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Carbs (g):</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Select Dining Hall:</label>
          <select
            value={selectedDiningHall}
            onChange={(e) => setSelectedDiningHall(e.target.value)}
            className="select-field"
          >
            <option value="">Select a dining hall</option>
            {DINING_HALLS.map((hall) => (
              <option key={hall.value} value={hall.value}>
                {hall.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Dining Time:</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="select-field"
          >
            <option value="">Select a dining time</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Search for Food Item</button>
      </form>

      {/* Pop-up card for displaying mock meal results */}
      {showPopup && (
        <div className="popup-card">
          <div className="popup-header">
            <h3>Available Meals</h3>
            <button onClick={handleClosePopup} className="close-button">X</button>
          </div>
          <div className="popup-content">
            <ul>
              {[1, 2, 3, 4, 5].map((meal, index) => (
                <li key={index} className="meal-item">
                  <p><strong>Meal {index + 1}</strong></p>
                  <p>Mock Food Item {index + 1}</p>
                  <p>Calories: 500 kcal</p>
                  <p>Proteins: 20g</p>
                  <p>Fats: 15g</p>
                  <p>Carbs: 60g</p>
                  <button onClick={() => handleAddToMealPlan(index)} className="add-button">+</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
