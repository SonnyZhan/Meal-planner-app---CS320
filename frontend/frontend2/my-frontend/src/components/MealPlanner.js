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
  const [prioritize, setPrioritize] = useState([]);
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
  
    if (!selectedDiningHall || !date || !timeSlot || !calories || !proteins || !carbs) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
  
    const formattedDate = new Date(date).toISOString().split("T")[0];
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.get("http://localhost:8000/api/find_food_combination/", {
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
  };

  const handleAddToMealPlan = async (mealIndex) => {
    const token = localStorage.getItem("token");
    const selectedMeal = meals[mealIndex]; // This is an array of food items.
  
    if (!token) {
      setError("User not authenticated. Please log in.");
      return;
    }
  
    try {
      // Extract menu_id from the first food item (assuming all items share the same menu_id)
      const menuId = selectedMeal[0]?.menu_id;
  
      if (!menuId) {
        console.error("Menu ID is missing in the selected meal.");
        setError("Failed to retrieve menu information.");
        return;
      }
  
      const payload = {
        combinations: [
          {
            menu: menuId, // Use the menu ID from the first food item
            meal_type: timeSlot,
            date: date,
            food_items: selectedMeal.map((food) => {
              if (!food.id) {
                console.error("Food ID missing:", food); // Log missing ID for debugging
                throw new Error("Food ID is missing.");
              }
              return food.id;
            }),
          },
        ],
      };
  
      console.log("Payload being sent to the backend:", payload);
  
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
      console.error("Error saving meal plan:", err.response?.data || err.message);
      setError("Failed to save meal plan.");
    }
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
        <div className="form-group">
          <label>Prioritize:</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                value="calories"
                onChange={handleCheckboxChange}
                checked={prioritize.includes("calories")}
              />
              Calories
            </label>
            <label>
              <input
                type="checkbox"
                value="protein"
                onChange={handleCheckboxChange}
                checked={prioritize.includes("protein")}
              />
              Proteins
            </label>
            <label>
              <input
                type="checkbox"
                value="total_carbs"
                onChange={handleCheckboxChange}
                checked={prioritize.includes("total_carbs")}
              />
              Carbs
            </label>
          </div>
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
                    <div key={idx}>
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
