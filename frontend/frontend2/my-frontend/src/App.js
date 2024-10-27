// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import DiningHallForm from "./components/DiningHallForm";
import MenuForm from "./components/MenuForm";
import FoodForm from "./components/FoodForm";
import MealPlanner from "./components/MealPlanner";
import MealCombinations from "./components/MealCombinations";
import Card from "./components/Card"; 

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
    setFoods([...foods, newFood]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Card />} />
        <Route
          path="/main"
          element={
            <div className="App">
              <h1>Meal Planner & Menu Management</h1>

              <DiningHallForm onDiningHallCreated={fetchDiningHalls} />
              <MenuForm
                diningHalls={diningHalls}
                foods={foods}
                onMenuCreated={fetchMenus}
              />
              <FoodForm onFoodAdded={handleFoodAdded} />
              <MealPlanner menus={menus} />
              <MealCombinations />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
