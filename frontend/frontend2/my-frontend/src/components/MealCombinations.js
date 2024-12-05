import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MealPlanner.css";

const MealCombinations = () => {
  const [storedMeals, setStoredMeals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Replace 1 with the actual user_id
    axios
      .get("http://localhost:8000/api/meal_planner/1/")
      .then((response) => {
        setStoredMeals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching meal planner data:", error);
        setError("An error occurred while fetching your meal planner data.");
      });
  }, []);

  return (
    <div className="meal-combinations-container">
      <h2>Your Meal Planner</h2>
      {error && <p className="error-message">{error}</p>}

      <table className="meal-planner-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal Time</th>
            <th>Dining Hall</th>
            <th>Foods</th>
          </tr>
        </thead>
        <tbody>
          {storedMeals.length > 0 ? (
            storedMeals.map((meal, index) => (
              <tr key={index}>
                <td>{meal.date}</td>
                <td>{meal.meal_time}</td>
                <td>{meal.dining_hall || "N/A"}</td>
                <td>
                  {meal.foods.map((food, idx) => (
                    <div key={idx}>
                      <strong>{food.dish_name}</strong>
                      <p>Calories: {food.calories}</p>
                      <p>Protein: {food.protein}</p>
                      <p>Carbs: {food.total_carb}</p>
                    </div>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No meals added to your planner yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MealCombinations;
