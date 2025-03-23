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

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

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
        onFoodAdded(response.data);
        resetForm();
        showToast("Food added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding food:", error);
        showToast("Failed to add food", "error");
      });
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
    <div className="food-form">
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? "Cancel" : "Add New Food"}
      </button>

      {showForm && (
        <form onSubmit={handleFoodSubmit} className="form-group">
          <h3 className="section-title">Add New Food</h3>

          <div className="form-control">
            <label htmlFor="foodName" className="form-label">
              Food Name:
            </label>
            <input
              id="foodName"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Enter food name"
              className="input-field"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="calories" className="form-label">
              Calories:
            </label>
            <input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter calories"
              className="input-field"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="proteins" className="form-label">
              Proteins (g):
            </label>
            <input
              id="proteins"
              type="number"
              value={proteins}
              onChange={(e) => setProteins(e.target.value)}
              placeholder="Enter protein content"
              className="input-field"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="fats" className="form-label">
              Fats (g):
            </label>
            <input
              id="fats"
              type="number"
              value={fats}
              onChange={(e) => setFats(e.target.value)}
              placeholder="Enter fat content"
              className="input-field"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="carbs" className="form-label">
              Carbs (g):
            </label>
            <input
              id="carbs"
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="Enter carbohydrate content"
              className="input-field"
              min="0"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Food
          </button>
        </form>
      )}
    </div>
  );
};

export default FoodForm;
