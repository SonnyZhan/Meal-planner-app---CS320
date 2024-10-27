// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DiningHallForm from "./components/DiningHallForm";
import MenuForm from "./components/MenuForm";
import FoodForm from "./components/FoodForm";
import MealPlanner from "./components/MealPlanner";
import MealCombinations from "./components/MealCombinations"; // Import the new component

const App = () => {
  const [diningHalls, setDiningHalls] = useState([]);
  const [foods, setFoods] = useState([]);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetchDiningHalls();
    fetchFoods();
    fetchMenus();
  }, []);

  const fetchDiningHalls = () => {
    axios
      .get("http://localhost:8000/api/dining_halls/")
      .then((response) => setDiningHalls(response.data))
      .catch((error) => console.error("Error fetching dining halls:", error));
  };

  const fetchFoods = () => {
    axios
      .get("http://localhost:8000/api/foods/")
      .then((response) => setFoods(response.data))
      .catch((error) => console.error("Error fetching foods:", error));
  };

  const fetchMenus = () => {
    axios
      .get("http://localhost:8000/api/menus/")
      .then((response) => setMenus(response.data))
      .catch((error) => console.error("Error fetching menus:", error));
  };

  const handleFoodAdded = (newFood) => {
    setFoods([...foods, newFood]); // Update foods list with the new food item
  };

  return (
    <div className="App">
      <h1>Meal Planner & Menu Management</h1>

      {/* Form to add new dining halls */}
      <DiningHallForm onDiningHallCreated={fetchDiningHalls} />

      {/* Form to add new menus, passing foods for selection */}
      <MenuForm diningHalls={diningHalls} foods={foods} onMenuCreated={fetchMenus} />

      {/* Form to add new food items */}
      <FoodForm onFoodAdded={handleFoodAdded} />

      {/* Component for meal planning based on available menus */}
      <MealPlanner menus={menus} />

      {/* Component to display saved meal combinations */}
      <MealCombinations />
    </div>
  );
};

export default App;
