import React, { useState } from "react";
import axios from "axios";
import "./MealPlanner.css";

const TIME_SLOTS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
];

const DINING_HALLS = [
  { value: "Worcester Commons", label: "Worcester" },
  { value: "Franklin Dining Commons", label: "Frank" },
  { value: "Berkshire Dining Commons", label: "Berkshire" },
  { value: "Hampshire Dining Commons", label: "Hamp" },
];

const MealPlanner = () => {
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [carbs, setCarbs] = useState("");
  const [selectedDiningHall, setSelectedDiningHall] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [prioritize, setPrioritize] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [swapMode, setSwapMode] = useState(false);

  const handleMealPlannerSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setShowPopup(false);
    setMeals([]);
    setSwapMode(false);
    setSelectedFood(null);

    if (
      !selectedDiningHall ||
      !date ||
      !timeSlot ||
      !calories ||
      !proteins ||
      !carbs
    ) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/find_food_combination/",
        {
          headers: {
            Authorization: `Token ${token}`,
          },
          params: {
            dining_hall: selectedDiningHall,
            date: formattedDate,
            meal: timeSlot,
            calories: parseInt(calories),
            total_carbs: parseFloat(carbs),
            protein: parseFloat(proteins),
            prioritize,
          },
        }
      );

      const data = response.data;
      console.log("API Response:", data);

      if (data.exact_matches) {
        setMeals(data.exact_matches);
        setShowPopup(true);
      } else if (data.closest_combinations) {
        setMeals(data.closest_combinations);
        setShowPopup(true);
      } else {
        setError("No food combinations found.");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(
        `An error occurred: ${err.response?.data?.error || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setPrioritize((prev) => [...prev, value]);
    } else {
      setPrioritize((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMeals([]);
    setSwapMode(false);
    setSelectedFood(null);
  };

  const handleAddToMealPlan = async (mealIndex) => {
    const token = localStorage.getItem("token");
    const selectedMeal = meals[mealIndex];

    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }

    try {
      const menuId = selectedMeal[0]?.menu_id;

      if (!menuId) {
        console.error("Menu ID is missing in the selected meal.");
        setError("Failed to retrieve menu information.");
        return;
      }

      const payload = {
        combinations: [
          {
            menu: menuId,
            meal_type: timeSlot,
            date: date,
            food_items: selectedMeal.map((food) => food.id),
          },
        ],
      };

      await axios.post(
        "http://localhost:8000/api/save_user_meal_combinations/",
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert("Meal plan saved successfully!");
      setShowPopup(false);
    } catch (err) {
      console.error(
        "Error saving meal plan:",
        err.response?.data || err.message
      );
      setError("Failed to save meal plan.");
    }
  };

  const handleSwapClick = (mealIndex, foodIndex, food) => {
    if (!swapMode) {
      setSelectedFood({ mealIndex, foodIndex, food });
      setSwapMode(true);
    } else {
      if (
        selectedFood.mealIndex === mealIndex &&
        selectedFood.foodIndex === foodIndex
      ) {
        setSwapMode(false);
        setSelectedFood(null);
        return;
      }

      const updatedMeals = [...meals];
      const sourceMeal = [...updatedMeals[selectedFood.mealIndex]];
      const targetMeal = [...updatedMeals[mealIndex]];

      const tempFood = sourceMeal[selectedFood.foodIndex];
      sourceMeal[selectedFood.foodIndex] = targetMeal[foodIndex];
      targetMeal[foodIndex] = tempFood;

      updatedMeals[selectedFood.mealIndex] = sourceMeal;
      updatedMeals[mealIndex] = targetMeal;

      setMeals(updatedMeals);

      setSwapMode(false);
      setSelectedFood(null);
    }
  };

  const cancelSwap = () => {
    setSwapMode(false);
    setSelectedFood(null);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <h2 className="card-title">Find Food Combinations</h2>
          <form onSubmit={handleMealPlannerSubmit}>
            <div className="form-group">
              <div className="form-control">
                <label>Calories:</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-control">
                <label>Proteins (g):</label>
                <input
                  type="number"
                  value={proteins}
                  onChange={(e) => setProteins(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-control">
                <label>Carbs (g):</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-control">
                <label>Select Dining Hall:</label>
                <select
                  value={selectedDiningHall}
                  onChange={(e) => setSelectedDiningHall(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select a dining hall</option>
                  {DINING_HALLS.map((hall) => (
                    <option key={hall.value} value={hall.value}>
                      {hall.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label>Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-control">
                <label>Dining Time:</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select a dining time</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label>Prioritize:</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="calories"
                      onChange={handleCheckboxChange}
                      checked={prioritize.includes("calories")}
                      className="checkbox"
                    />
                    <span>Calories</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="protein"
                      onChange={handleCheckboxChange}
                      checked={prioritize.includes("protein")}
                      className="checkbox"
                    />
                    <span>Proteins</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="total_carbs"
                      onChange={handleCheckboxChange}
                      checked={prioritize.includes("total_carbs")}
                      className="checkbox"
                    />
                    <span>Carbs</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                {loading ? "Loading..." : "Search for Food Item"}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Recommended Meals</h3>
              <button onClick={handleClosePopup} className="close-button">
                ×
              </button>
            </div>
            <div className="modal-body">
              {swapMode && (
                <div className="swap-instructions">
                  <p>Select another food item to swap with the selected one</p>
                  <button onClick={cancelSwap} className="cancel-swap-button">
                    Cancel Swap
                  </button>
                </div>
              )}
              <div className="meals-grid">
                {meals.map((meal, index) => {
                  const totals = meal.reduce(
                    (acc, item) => ({
                      calories: acc.calories + (item.calories || 0),
                      protein: acc.protein + parseFloat(item.protein || 0),
                      carbs: acc.carbs + parseFloat(item.total_carbs || 0),
                    }),
                    { calories: 0, protein: 0, carbs: 0 }
                  );

                  return (
                    <div key={index} className="meal-card">
                      <div className="meal-card-header">
                        <h4>Option {index + 1}</h4>
                        <div className="meal-card-badge">
                          {Math.abs(totals.calories - parseInt(calories)) <= 50
                            ? "Perfect Match! 🎯"
                            : "Close Match"}
                        </div>
                      </div>
                      <div className="meal-items">
                        {meal.map((item, idx) => {
                          const isSelected =
                            swapMode &&
                            selectedFood &&
                            selectedFood.mealIndex === index &&
                            selectedFood.foodIndex === idx;

                          return (
                            <div
                              key={idx}
                              className={`food-item ${
                                isSelected ? "selected-for-swap" : ""
                              }`}
                            >
                              <div className="food-item-header">
                                <h5>{item.dish_name}</h5>
                                <button
                                  className={`swap-button ${
                                    isSelected ? "selected" : ""
                                  }`}
                                  onClick={() =>
                                    handleSwapClick(index, idx, item)
                                  }
                                  title={
                                    swapMode
                                      ? "Click to swap with this food"
                                      : "Click to select for swapping"
                                  }
                                >
                                  {isSelected ? "✓" : "⇄"}
                                </button>
                              </div>
                              <div className="nutrition-info">
                                <span className="nutrition-badge calories">
                                  <span className="badge-icon">🔥</span>
                                  {item.calories} kcal
                                </span>
                                <span className="nutrition-badge protein">
                                  <span className="badge-icon">🥩</span>
                                  {item.protein} g
                                </span>
                                <span className="nutrition-badge carbs">
                                  <span className="badge-icon">🌾</span>
                                  {item.total_carbs} g
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="meal-totals">
                        <h6>Meal Totals</h6>
                        <div className="totals-grid">
                          <div className="total-item">
                            <span className="total-label">Total Calories</span>
                            <span className="total-value">
                              {Math.round(totals.calories)} kcal
                            </span>
                            <span className="total-diff">
                              {totals.calories > parseInt(calories) ? "+" : ""}
                              {Math.round(
                                totals.calories - parseInt(calories)
                              )}{" "}
                              kcal
                            </span>
                          </div>
                          <div className="total-item">
                            <span className="total-label">Total Protein</span>
                            <span className="total-value">
                              {Math.round(totals.protein)} g
                            </span>
                            <span className="total-diff">
                              {totals.protein > parseFloat(proteins) ? "+" : ""}
                              {Math.round(
                                totals.protein - parseFloat(proteins)
                              )}{" "}
                              g
                            </span>
                          </div>
                          <div className="total-item">
                            <span className="total-label">Total Carbs</span>
                            <span className="total-value">
                              {Math.round(totals.carbs)} g
                            </span>
                            <span className="total-diff">
                              {totals.carbs > parseFloat(carbs) ? "+" : ""}
                              {Math.round(totals.carbs - parseFloat(carbs))} g
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToMealPlan(index)}
                        className="add-button"
                      >
                        Add to Meal Plan
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
