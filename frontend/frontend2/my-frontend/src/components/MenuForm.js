// src/components/MenuForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuForm = ({ onMenuCreated }) => {
  const [diningHalls, setDiningHalls] = useState([]);
  const [selectedDiningHall, setSelectedDiningHall] = useState("");
  const [menuName, setMenuName] = useState("");
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

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/dining_halls/")
      .then((response) => {
        setDiningHalls(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dining halls:", error);
        showToast("Failed to fetch dining halls", "error");
      });
  }, []);

  const handleMenuSubmit = (event) => {
    event.preventDefault();

    const newMenu = {
      name: menuName,
      dining_hall: selectedDiningHall,
    };

    axios
      .post("http://localhost:8000/api/menus/", newMenu)
      .then(() => {
        onMenuCreated();
        setMenuName("");
        setSelectedDiningHall("");
        setShowForm(false);
        showToast("Menu created successfully", "success");
      })
      .catch((error) => {
        console.error("Error creating menu:", error);
        showToast("Failed to create menu", "error");
      });
  };

  return (
    <div className="MenuForm">
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary mb-4"
      >
        {showForm ? "Cancel" : "Add New Menu"}
      </button>

      {showForm && (
        <form onSubmit={handleMenuSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Create New Menu</h3>
          <div className="form-control">
            <label htmlFor="diningHall" className="form-label">
              Dining Hall:
            </label>
            <select
              id="diningHall"
              value={selectedDiningHall}
              onChange={(e) => setSelectedDiningHall(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a dining hall</option>
              {diningHalls.map((hall) => (
                <option key={hall.id} value={hall.id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="menuName" className="form-label">
              Menu Name:
            </label>
            <input
              id="menuName"
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Enter menu name"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Save Menu
          </button>
        </form>
      )}
    </div>
  );
};

export default MenuForm;
