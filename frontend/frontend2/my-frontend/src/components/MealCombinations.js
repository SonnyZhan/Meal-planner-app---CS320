// src/components/MealCombinations.js
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
          {mealCombinations.map((combination) => (
            <li key={combination.id}>
              <strong>Menu ID:</strong> {combination.menu} <br />
              <strong>Calories:</strong> {combination.calories} kcal <br />
              <strong>Proteins:</strong> {combination.proteins}g <br />
              <strong>Fats:</strong> {combination.fats}g <br />
              <strong>Carbs:</strong> {combination.carbs}g <br />
              <strong>Foods:</strong>
              <ul>
                {combination.foods.map((food) => (
                  <li key={food.id}>
                    {food.name}: {food.calories} kcal, {food.proteins}g proteins, {food.fats}g fats, {food.carbs}g carbs
                  </li>
                ))}
              </ul>
              <strong>Created At:</strong> {new Date(combination.created_at).toLocaleString()}
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
