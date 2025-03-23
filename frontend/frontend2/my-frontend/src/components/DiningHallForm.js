// src/components/DiningHallForm.js
import React, { useState } from "react";
import axios from "axios";

const DiningHallForm = ({ onDiningHallCreated }) => {
  const [diningHallName, setDiningHallName] = useState("");
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

  const handleDiningHallSubmit = (event) => {
    event.preventDefault();

    const newDiningHall = { name: diningHallName };

    axios
      .post("http://localhost:8000/api/dining_halls/", newDiningHall)
      .then(() => {
        onDiningHallCreated();
        setDiningHallName("");
        setShowForm(false);
        showToast("Dining hall created successfully", "success");
      })
      .catch((error) => {
        console.error("Error creating dining hall:", error);
        showToast("Failed to create dining hall", "error");
      });
  };

  return (
    <div className="dining-hall-form">
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? "Cancel" : "Add New Dining Hall"}
      </button>

      {showForm && (
        <form onSubmit={handleDiningHallSubmit} className="form-group">
          <h3 className="section-title">Create New Dining Hall</h3>
          <div className="form-control">
            <label htmlFor="diningHallName" className="form-label">
              Name:
            </label>
            <input
              id="diningHallName"
              type="text"
              value={diningHallName}
              onChange={(e) => setDiningHallName(e.target.value)}
              placeholder="Enter dining hall name"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Save Dining Hall
          </button>
        </form>
      )}
    </div>
  );
};

export default DiningHallForm;
