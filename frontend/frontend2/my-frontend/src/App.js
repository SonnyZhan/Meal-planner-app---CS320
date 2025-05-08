// App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import DiningHallForm from "./components/DiningHallForm";
import MenuForm from "./components/MenuForm";
import FoodForm from "./components/FoodForm";
import MealPlanner from "./components/MealPlanner";
import MealCombinations from "./components/MealCombinations";
import Card from "./components/Card";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import DietaryRestrictions from "./components/DietaryRestrictions";
import ProfilePage from "./components/ProfilePage";
import LandingPage from "./components/LandingPage";
import { useMsal } from "@azure/msal-react";

const App = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getAllAccounts()[0];
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
      <div className="app">
        {activeAccount && <NavigationBar />}
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                activeAccount ? (
                  <Navigate to="/allergy-filter" />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/login"
              element={
                activeAccount ? (
                  <Navigate to="/allergy-filter" />
                ) : (
                  <LandingPage />
                )
              }
            />
            <Route
              path="/allergy-filter"
              element={
                activeAccount ? (
                  <DietaryRestrictions />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/search-food"
              element={
                activeAccount ? (
                  <MealPlanner menus={menus} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/meal-planner"
              element={
                activeAccount ? <MealCombinations /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile"
              element={
                activeAccount ? <ProfilePage /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
