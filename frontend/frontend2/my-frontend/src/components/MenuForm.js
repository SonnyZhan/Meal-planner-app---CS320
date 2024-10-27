// src/components/MenuForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TIME_SLOTS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "brunch", label: "Brunch" },
  { value: "dinner", label: "Dinner" },
  { value: "late night", label: "Late Night" },
];

const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

const MenuForm = ({ diningHalls, foods, onMenuCreated }) => {
  const [selectedDiningHall, setSelectedDiningHall] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);

  const handleMenuSubmit = (event) => {
    event.preventDefault();

    const menuData = {
      dining_hall: selectedDiningHall,
      time_slot: timeSlot,
      day_of_week: dayOfWeek || null,  // Optional field
      date: date || null,              // Optional field
      foods: selectedFoods,            // List of food IDs
      description,
      is_special: isSpecial,
    };

    axios
      .post("http://localhost:8000/api/create_menu/", menuData)
      .then((response) => {
        onMenuCreated(response.data);  // Notify parent component
        resetForm();
      })
      .catch((error) => console.error("Error creating menu:", error));
  };

  const resetForm = () => {
    setSelectedDiningHall("");
    setTimeSlot("");
    setDayOfWeek("");
    setDate("");
    setDescription("");
    setIsSpecial(false);
    setSelectedFoods([]);
  };

  return (
    <div className="MenuForm">
      <h2>Create New Menu</h2>
      <form onSubmit={handleMenuSubmit}>
        <div>
          <label>Dining Hall:</label>
          <select
            value={selectedDiningHall}
            onChange={(e) => setSelectedDiningHall(e.target.value)}
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
        <div>
          <label>Time Slot:</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Day of the Week:</label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          >
            <option value="">Select a day (optional)</option>
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Special Menu:</label>
          <input
            type="checkbox"
            checked={isSpecial}
            onChange={(e) => setIsSpecial(e.target.checked)}
          />
        </div>
        <div>
          <label>Select Foods:</label>
          <select
            multiple
            value={selectedFoods}
            onChange={(e) =>
              setSelectedFoods([...e.target.selectedOptions].map(o => o.value))
            }
          >
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Save Menu</button>
      </form>
    </div>
  );
};

export default MenuForm;
