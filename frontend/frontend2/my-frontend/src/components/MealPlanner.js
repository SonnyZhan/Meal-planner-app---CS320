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
  const [showPopup, setShowPopup] = useState(false);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMealPlannerSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setShowPopup(false);
    setMeals([]);

    // Validate inputs
    if (!selectedDiningHall || !date || !timeSlot || !calories || !proteins || !carbs) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Format the date to YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split("T")[0];

    try {
      console.log("Request Params:", {
        dining_hall: selectedDiningHall,
        date: formattedDate,
        meal: timeSlot,
        calories: parseInt(calories),
        total_carbs: parseFloat(carbs),
        protein: parseFloat(proteins),
      });

      // Make the API request
      const response = await axios.get(`http://localhost:8000/api/find_food_combination/`, {
        params: {
          dining_hall: selectedDiningHall,
          date: formattedDate,
          meal: timeSlot,
          calories: parseInt(calories),
          total_carbs: parseFloat(carbs),
          protein: parseFloat(proteins),
        },
      });

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
      setError(`An error occurred: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setMeals([]);
  };

  const handleAddToMealPlan = async (mealIndex) => {
    const meal = meals[mealIndex];
    const formattedDate = new Date(date).toISOString().split("T")[0];
  
    try {
      await axios.post("http://localhost:8000/api/add_meal_to_planner/", {
        user_id: 1, // Replace with the actual user's ID
        meal_time: timeSlot,
        date: formattedDate,
        dining_hall: selectedDiningHall,
        foods: meal.map((food) => ({
          dish_name: food.dish_name,
        })),
      });
      alert(`Meal ${mealIndex + 1} added to the meal planner`);
    } catch (error) {
      console.error("Error adding meal to planner:", error);
      alert("Failed to add meal. Please try again.");
    }
    setShowPopup(false);
  };
  
  
  
  return (
    <div className="meal-planner-container">
      <h2>Find Food Combinations</h2>
      <form onSubmit={handleMealPlannerSubmit} className="meal-planner-form">
        <div className="form-group">
          <label>Calories:</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label>Proteins (g):</label>
          <input
            type="number"
            value={proteins}
            onChange={(e) => setProteins(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label>Carbs (g):</label>
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label>Select Dining Hall:</label>
          <select
            value={selectedDiningHall}
            onChange={(e) => setSelectedDiningHall(e.target.value)}
            className="select-field"
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
        <div className="form-group">
          <label>Date (YYYY-MM-DD):</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <label>Dining Time:</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="select-field"
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
        <button type="submit" className="submit-button">
          {loading ? "Loading..." : "Search for Food Item"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {showPopup && (
        <div className="popup-card">
          <div className="popup-header">
            <h3>Available Meals</h3>
            <button onClick={handleClosePopup} className="close-button">
              X
            </button>
          </div>
          <div className="popup-content">
            <ul>
              {meals.map((meal, index) => (
                <li key={index} className="meal-item">
                  <p><strong>Meal {index + 1}</strong></p>
                  {meal.map((item, idx) => (
                    <div className="ingredients" key={idx}>
                      <p>{item.dish_name}</p>
                      <p>Calories: {item.calories} kcal</p>
                      <p>Proteins: {item.protein} g</p>
                      <p>Carbs: {item.total_carbs} g</p>
                    </div>
                  ))}
                  <button onClick={() => handleAddToMealPlan(index)} className="add-button">
                    +
                  </button>
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
