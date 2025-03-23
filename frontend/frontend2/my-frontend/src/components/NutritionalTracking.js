import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import axios from "axios";
import "./NutritionalTracking.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
//basically the fetchWeeklyData will talk to our backend database (in urls.py in the backend folder)
//there is a route which calls a method that returns a 2D array in the following format
// {
//   'id': combination.id, 
//   'date': combination.date,
//   'meal_type': combination.meal_type,
//   'menu': combination.menu.id,
//   'food_items': [
//       {
//           'name': food.dish_name,
//           'calories': food.calories,
//           'protein': food.protein,
//           'carbs': food.total_carb,
//       }
// }

//we can process the raw data got from this method, and using useState, set it to the 
//weekly data variable

//now the graph isn't working, but theres a better way to represent this data, and also a better library
//so this branch will attempt to do that

//since this component has a styling sheet, and is called in main componenet, ill just focus on 
//changing up the graphing library logic and stuff

const NutritionalTracking = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weekly nutritional data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/user_meal_combinations/",
          {
            headers: { Authorization: `Token ${token}` },
            params: { date_range: 7 },
          }
        );

        // Process the data to get daily totals
        const processedData = processWeeklyData(response.data);
        setWeeklyData(processedData);
      } catch (err) {
        setError("Failed to fetch nutritional data");
        console.error("Error fetching weekly data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  // Process weekly data to get daily totals
  const processWeeklyData = (data) => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day) => {
      const dayData = data.filter(
        (item) =>
          format(new Date(item.date), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      );

      const totals = dayData.reduce(
        (acc, meal) => {
          meal.food_items.forEach((item) => {
            acc.calories += item.calories || 0;
            acc.protein += parseFloat(item.protein) || 0;
            acc.carbs += parseFloat(item.carbs) || 0;
          });
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0 }
      );

      return {
        date: format(day, "EEE"),
        ...totals,
      };
    });
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Nutritional Intake",
        color: "#881c1c",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(136, 28, 28, 0.1)",
        },
        ticks: {
          color: "#881c1c",
        },
      },
      x: {
        grid: {
          color: "rgba(136, 28, 28, 0.1)",
        },
        ticks: {
          color: "#881c1c",
        },
      },
    },
  };

  // Chart data
  const chartData = {
    labels: weeklyData.map((day) => day.date),
    datasets: [
      {
        label: "Calories",
        data: weeklyData.map((day) => day.calories),
        borderColor: "#881c1c",
        backgroundColor: "rgba(136, 28, 28, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Protein (g)",
        data: weeklyData.map((day) => day.protein),
        borderColor: "#c41e3a",
        backgroundColor: "rgba(196, 30, 58, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Carbs (g)",
        data: weeklyData.map((day) => day.carbs),
        borderColor: "#2c5282",
        backgroundColor: "rgba(44, 82, 130, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading nutritional data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="nutritional-tracking">
      <div className="chart-container">
        <div className="chart-header">
          <h2>Weekly Nutritional Overview</h2>
          <div className="date-selector">
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="date-input"
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <Line options={options} data={chartData} />
        </div>
      </div>

      <div className="nutritional-summary">
        <h3>Daily Summary</h3>
        <div className="summary-grid">
          {weeklyData.map((day, index) => (
            <div key={index} className="summary-card">
              <h4>{day.date}</h4>
              <div className="summary-item">
                <span>Calories:</span>
                <span>{Math.round(day.calories)} kcal</span>
              </div>
              <div className="summary-item">
                <span>Protein:</span>
                <span>{Math.round(day.protein)}g</span>
              </div>
              <div className="summary-item">
                <span>Carbs:</span>
                <span>{Math.round(day.carbs)}g</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionalTracking;
