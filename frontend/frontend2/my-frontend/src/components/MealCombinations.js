import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MealCombinations.css";

const UserMealCombinations = () => {
  const [mealCombinations, setMealCombinations] = useState([]);
  const [error, setError] = useState("");

  const generateDates = () => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
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
        console.log("API Response:", response.data); // Debugging log
        setMealCombinations(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching user meal combinations:", error);
        setError("An error occurred while fetching your meal combinations.");
      });
  }, []);

  const handleDelete = async (combinationId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8000/api/delete_user_meal_combination/${combinationId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setMealCombinations((prevCombinations) =>
        prevCombinations.filter((combo) => combo.id !== combinationId)
      );

      alert("Meal combination deleted successfully!");
    } catch (error) {
      console.error("Error deleting meal combination:", error);
      setError("Failed to delete meal combination.");
    }
  };

  return (
    <div className="MealCombinations">
      <h2>Your Meal Planner</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="meal-grid">
        <div className="row-header-placeholder"></div>
        {dates.map((day, colIndex) => (
          <div key={colIndex} className="header">
            <span>{day.day}</span>
            <br />
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
                    mealsForDayAndType.map((combo, idx) => (
                      <div key={idx} className="meal-content">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(combo.id)}
                        >
                          Delete
                        </button>
                        {combo.food_items.map((item, itemIdx) => (
                          <div key={itemIdx}>
                            <p>{item.name}</p>
                            <p>Calories: {item.calories} kcal</p>
                            <p>Proteins: {item.protein} g</p>
                            <p>Carbs: {item.carbs} g</p>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <p>No meals planned</p>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserMealCombinations;
