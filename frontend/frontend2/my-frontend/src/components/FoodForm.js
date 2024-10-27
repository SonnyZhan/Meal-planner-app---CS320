// src/components/FoodForm.js
import React, { useState } from "react";
import axios from "axios";

const FoodForm = ({ onFoodAdded }) => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleFoodSubmit = (event) => {
    event.preventDefault();

    const foodData = {
      name: foodName,
      calories: parseFloat(calories),
      proteins: parseFloat(proteins),
      fats: parseFloat(fats),
      carbs: parseFloat(carbs),
    };

    axios
      .post("http://localhost:8000/api/create_food/", foodData)
      .then((response) => {
        onFoodAdded(response.data);  // Notify parent of new food item
        resetForm();
      })
      .catch((error) => console.error("Error adding food:", error));
  };

  const resetForm = () => {
    setFoodName("");
    setCalories("");
    setProteins("");
    setFats("");
    setCarbs("");
    setShowForm(false);
  };

  return (
    <div className="FoodForm">
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Food"}
      </button>

      {showForm && (
        <form onSubmit={handleFoodSubmit}>
          <h2>Add New Food</h2>
          <div>
            <label>Food Name:</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit">Add Food</button>
        </form>
      )}
    </div>
  );
};

export default FoodForm;
