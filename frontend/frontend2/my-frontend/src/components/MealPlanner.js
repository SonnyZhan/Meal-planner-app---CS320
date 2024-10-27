// src/components/MealPlanner.js
import React, { useState } from "react";
import axios from "axios";

const MealPlanner = ({ menus }) => {
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [savedCombinations, setSavedCombinations] = useState([]); // Store the combinations from backend
  const [error, setError] = useState("");

  const handleMealPlannerSubmit = (event) => {
    event.preventDefault();

    if (!calories || !proteins || !fats || !carbs || !selectedMenu) {
      setError("All fields are required.");
      return;
    }

    const requestData = {
      menu_id: selectedMenu,
      calories: parseFloat(calories),
      proteins: parseFloat(proteins),
      fats: parseFloat(fats),
      carbs: parseFloat(carbs),
    };

    axios
      .post("http://localhost:8000/api/search_food_combinations/", requestData)
      .then((response) => {
        // If combinations are found, they are saved to the database and returned
        setSavedCombinations(response.data); // Store the saved combinations
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching food combinations:", error);
        setError("An error occurred while fetching food combinations.");
      });
  };

  return (
    <div className="MealPlanner">
      <h2>Find and Save Meal Combinations</h2>
      <form onSubmit={handleMealPlannerSubmit}>
        <div>
          <label>Calories:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Proteins (g):</label>
          <input
            type="number"
            value={proteins}
            onChange={(e) => setProteins(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fats (g):</label>
          <input
            type="number"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Carbs (g):</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Select Menu:</label>
          <select
            value={selectedMenu}
            onChange={(e) => setSelectedMenu(e.target.value)}
            required
          >
            <option value="">Select a menu</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.dining_hall} - {menu.time_slot}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Find and Save Meal Combinations</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {savedCombinations.length > 0 && (
        <div>
          <h3>Saved Meal Combinations</h3>
          <ul>
            {savedCombinations.map((combination, index) => (
              <li key={index}>
                <div>
                  <strong>Combination {index + 1}</strong>
                  <ul>
                    {combination.foods.map((food) => (
                      <li key={food.id}>
                        {food.name}: {food.calories} kcal, {food.proteins}g proteins, {food.fats}g fats, {food.carbs}g carbs
                      </li>
                    ))}
                  </ul>
                  <p>Total Calories: {combination.calories}</p>
                  <p>Total Proteins: {combination.proteins}g</p>
                  <p>Total Fats: {combination.fats}g</p>
                  <p>Total Carbs: {combination.carbs}g</p>
                  <p>Created At: {new Date(combination.created_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
