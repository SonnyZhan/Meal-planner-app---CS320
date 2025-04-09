import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MealCombinations.css";

const UserMealCombinations = () => {
  const [mealCombinations, setMealCombinations] = useState([]);
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weightLoss, setWeightLoss] = useState("");
  const [dailyCalories, setDailyCalories] = useState(null);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("1.55"); // Default to moderately active

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        formattedDate,
      };
    });
  };

  const dates = generateDates();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/user_meal_combinations/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: {
          date_range: 7,
        },
      })
      .then((response) => {
        setMealCombinations(response.data);
        setError("");
      })
      .catch((error) => {
        setError("An error occurred while fetching your meal combinations.");
      });
  }, []);

  const handleDelete = async (combinationId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:8000/api/delete_user_meal_combination/${combinationId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setMealCombinations((prevCombinations) =>
        prevCombinations.filter((combo) => combo.id !== combinationId)
      );

      alert("Meal combination deleted successfully!");
    } catch (error) {
      setError("Failed to delete meal combination.");
    }
  };

  const handleOpenModal = (mealDetails) => {
    setSelectedMeal(mealDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setShowModal(false);
  };

  const calculateCalories = () => {
    const weightKg = parseFloat(weight) * 0.453592;
    const totalInches = parseFloat(feet) * 12 + parseFloat(inches);
    const heightCm = totalInches * 2.54;
    const age = 25; // Default age, can be made configurable
    const weightLossKg = parseFloat(weightLoss) * 0.453592;

    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Calculate TDEE
    const tdee = bmr * parseFloat(activityLevel);

    // Safe weight loss parameters
    const minWeeklyLoss = 0.5; // 0.5 kg/week
    const maxWeeklyLoss = 1; // 1 kg/week
    const caloriesPerKg = 7700;

    // Calculate weeks needed
    const minWeeks = Math.ceil(weightLossKg / maxWeeklyLoss);
    const maxWeeks = Math.ceil(weightLossKg / minWeeklyLoss);

    // Calculate calorie range
    const minCalories = Math.max(
      tdee - (maxWeeklyLoss * caloriesPerKg) / 7,
      gender === "male" ? 2200 : 1600
    );
    const maxCalories = Math.max(
      tdee - (minWeeklyLoss * caloriesPerKg) / 7,
      gender === "male" ? 2200 : 1600
    );

    // Check for unsafe calorie levels
    if (minCalories < (gender === "male" ? 2200 : 1600)) {
      setWarningMessage(
        "Warning: Your weight loss goal may require unsafe calorie restriction. " +
          "We recommend a more gradual approach to maintain health."
      );
      setShowWarningPopup(true);
    }

    setDailyCalories({
      min: Math.round(minCalories),
      max: Math.round(maxCalories),
      weeks: {
        min: minWeeks,
        max: maxWeeks,
      },
    });
  };

  const calculateProtein = () => {
    const weightKg = parseFloat(weight) * 0.453592;

    // General recommendation: 1.6-2.2g protein per kg of body weight
    const proteinMin = Math.round(weightKg * 1.6);
    const proteinMax = Math.round(weightKg * 2.2);

    return { proteinMin, proteinMax };
  };

  return (
    <div className="MealCombinations">
      <h2>Your Meal Planner</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="calculator-container">
        <button
          className="calculator-button"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          🧮 Calorie Calculator
        </button>

        {showCalculator && (
          <div className="calculator-popup">
            <div className="calculator-content">
              <h3>Calorie & Protein Calculator</h3>
              <div className="disclaimer">
                <p>⚠️ Important Safety Information:</p>
                <ul>
                  <li>
                    Minimum safe calorie intake: 1600 kcal/day for women, 2200
                    kcal/day for men
                  </li>
                  <li>Healthy weight loss: 0.5-1 kg (1-2 lbs) per week</li>
                  <li>Extreme calorie restriction can be dangerous</li>
                  <li>Always consult a healthcare professional</li>
                </ul>
              </div>
              <div className="input-group">
                <label>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="input-group">
                <label>Weight (lbs):</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>Height:</label>
                <div className="height-inputs">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Inches"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    min="0"
                    max="11"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Activity Level:</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="1.2">Sedentary (little to no exercise)</option>
                  <option value="1.375">
                    Lightly active (light exercise 1-3 days/week)
                  </option>
                  <option value="1.55">
                    Moderately active (moderate exercise 3-5 days/week)
                  </option>
                  <option value="1.725">
                    Very active (heavy exercise 6-7 days/week)
                  </option>
                  <option value="1.9">
                    Extremely active (strenuous training 2 times a day)
                  </option>
                </select>
              </div>
              <div className="input-group">
                <label>Weight Loss Goal (lbs):</label>
                <input
                  type="number"
                  value={weightLoss}
                  onChange={(e) => setWeightLoss(e.target.value)}
                  min="0"
                />
              </div>
              <button className="calculate-button" onClick={calculateCalories}>
                Calculate
              </button>

              {dailyCalories && (
                <div className="result">
                  <h4>Recommended Daily Calorie Range:</h4>
                  <p>
                    {dailyCalories.min} - {dailyCalories.max} kcal
                  </p>
                  <h4>Estimated Time Frame:</h4>
                  <p>
                    {dailyCalories.weeks.min} - {dailyCalories.weeks.max} weeks
                  </p>
                  <div className="warning-note">
                    <p>
                      ⚠️ Always maintain a minimum of{" "}
                      {gender === "male" ? "2200" : "1600"} calories per day for
                      safe weight loss.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="meal-grid">
        <div className="row-header-placeholder"></div>
        {dates.map((day, colIndex) => (
          <div key={colIndex} className="header">
            <span>{day.day}</span>
            <span>{day.date}</span>
          </div>
        ))}

        {["Breakfast", "Lunch", "Dinner"].map((meal, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            <div className="row-header">{meal}</div>
            {dates.map((day, colIndex) => {
              const mealsForDayAndType = mealCombinations.filter(
                (combo) =>
                  combo.date === day.formattedDate &&
                  combo.meal_type.toLowerCase() === meal.toLowerCase()
              );

              return (
                <div key={`cell-${rowIndex}-${colIndex}`} className="meal-cell">
                  {mealsForDayAndType.length > 0 ? (
                    <button
                      className="view-meal-button"
                      onClick={() => handleOpenModal(mealsForDayAndType)}
                    >
                      View Meals
                    </button>
                  ) : (
                    <p>No meals planned</p>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {showModal && selectedMeal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Available Meals</h3>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedMeal.map((combo, idx) => (
                <div key={idx} className="meal-details">
                  <p>
                    <strong>Meal {idx + 1}</strong>
                  </p>
                  {combo.food_items.map((item, itemIdx) => (
                    <div key={itemIdx} className="food-item">
                      <p>
                        <strong>{item.name}</strong>
                      </p>
                      <p>Calories: {item.calories} kcal</p>
                      <p>Proteins: {item.protein} g</p>
                      <p>Carbs: {item.carbs} g</p>
                    </div>
                  ))}
                  <button
                    className="delete-button"
                    onClick={() => {
                      handleDelete(combo.id);
                      handleCloseModal();
                    }}
                  >
                    Delete Meal
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showWarningPopup && (
        <div className="warning-popup-overlay">
          <div className="warning-popup">
            <h3>⚠️ Important Notice</h3>
            <p>{warningMessage}</p>
            <button
              className="warning-popup-button"
              onClick={() => setShowWarningPopup(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMealCombinations;
