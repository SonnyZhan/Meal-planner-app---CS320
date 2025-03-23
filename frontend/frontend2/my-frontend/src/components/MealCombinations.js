import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MealCombinations.css";

const UserMealCombinations = () => {
  const [mealCombinations, setMealCombinations] = useState([]);
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="MealCombinations">
      <h2>Your Meal Planner</h2>
      {error && <div className="error-message">{error}</div>}
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
    </div>
  );
};

export default UserMealCombinations;
