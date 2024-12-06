import React, { useState, useEffect } from "react";
import axios from "axios";

const MealCombinations = () => {
  const [mealCombinations, setMealCombinations] = useState([]);
  const [error, setError] = useState("");

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
      <h2>Saved Meal Combinations</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mealCombinations.length > 0 ? (
        <ul>
          {mealCombinations.map((combination, index) => (
            <li key={index}>
              <p><strong>Meal Name:</strong> {combination.meal_name}</p>
              <p><strong>Total Calories:</strong> {combination.calories} kcal</p>
              <p><strong>Total Proteins:</strong> {combination.protein} g</p>
              <p><strong>Total Carbs:</strong> {combination.carbs} g</p>
              <p><strong>Dishes:</strong></p>
              <ul>
                {combination.dishes.map((dish, idx) => (
                  <li key={idx}>{dish}</li>
                ))}
              </ul>
              <p><strong>Saved At:</strong> {new Date(combination.saved_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved meal combinations found.</p>
      )}
    </div>
  );
};

export default MealCombinations;