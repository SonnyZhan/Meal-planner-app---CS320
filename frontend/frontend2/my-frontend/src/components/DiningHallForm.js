// src/components/DiningHallForm.js
import React, { useState } from "react";
import axios from "axios";

const DiningHallForm = ({ onDiningHallCreated }) => {
  const [diningHallName, setDiningHallName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleDiningHallSubmit = (event) => {
    event.preventDefault();

    const newDiningHall = { name: diningHallName };

    axios
      .post("http://localhost:8000/api/dining_halls/", newDiningHall)
      .then(() => {
        onDiningHallCreated();
        setDiningHallName("");
        setShowForm(false);
      })
      .catch((error) => console.error("Error creating dining hall:", error));
  };

  return (
    <div className="DiningHallForm">
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add New Dining Hall"}
      </button>

      {showForm && (
        <form onSubmit={handleDiningHallSubmit}>
          <h2>Create New Dining Hall</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={diningHallName}
              onChange={(e) => setDiningHallName(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save Dining Hall</button>
        </form>
      )}
    </div>
  );
};

export default DiningHallForm;
