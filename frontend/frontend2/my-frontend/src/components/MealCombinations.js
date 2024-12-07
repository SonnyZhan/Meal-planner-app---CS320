// src/components/MealCombinations.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MealCombinations.css";

const MealCombinations = () => {
  const [mealCombinations, setMealCombinations] = useState([]);
  const [error, setError] = useState("");

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  };

  const dates = generateDates();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/meal_combinations/")
      .then((response) => {
        setMealCombinations(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching meal combinations:", error);
        setError("An error occurred while fetching meal combinations.");
      });
  }, []);

  return (
    <div className="MealCombinations">
      <h2>Meal Planner</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="meal-grid">
        {/* Row for date headers */}
        <div className="row-header-placeholder"></div>
        {dates.map((day, colIndex) => (
          <div key={colIndex} className="header">
            <span>{day.day}</span>
            <br />
            <span>{day.date}</span>
          </div>
        ))}

        {/* Row headers and grid cells */}
        {["Breakfast", "Lunch", "Dinner"].map((meal, rowIndex) => (
          <>
            <div key={`row-${rowIndex}`} className="row-header">
              {meal}
            </div>
            {dates.map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="meal-cell">
                <div className="meal-content">Meal Info</div>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default MealCombinations;
