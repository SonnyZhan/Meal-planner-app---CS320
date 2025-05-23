import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subWeeks,
  addWeeks,
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
  Legend,
  BarElement
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
  //const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dailyMeals, setDailyMeals] = useState([]);
  const [selectedDailyDate, setSelectedDailyDate] = useState(new Date());

  // Fetch weekly nutritional data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);

        const response = await axios.get(
          "http://localhost:8000/api/user_meal_combinations/",
          {
            headers: { Authorization: `Token ${token}` },
            params: {
              start_date: format(weekStart, "yyyy-MM-dd"),
              end_date: format(weekEnd, "yyyy-MM-dd"),
            },
          }
        );

        const processedData = processWeeklyData(response.data);
        setWeeklyData(processedData);

        // Process daily meals for the selected date
        const selectedDateStr = format(selectedDailyDate, "yyyy-MM-dd");
        const selectedDayMeals = response.data.filter(
          (item) =>
            format(new Date(item.date), "yyyy-MM-dd") === selectedDateStr
        );
        setDailyMeals(selectedDayMeals);
      } catch (err) {
        setError("Failed to fetch nutritional data");
        console.error("Error fetching weekly data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [selectedDate, selectedDailyDate]);

  // Process weekly data to get daily totals
  const processWeeklyData = (data) => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return days.map((day) => {
      const formattedDay = format(day, "yyyy-MM-dd");
      const dayData = data.filter((item) => item.date === formattedDay);

      const totals = dayData.reduce(
        (acc, meal) => {
          meal.food_items.forEach((item) => {
            const proteinValue =
              parseFloat(item.protein.replace(/[^0-9.-]+/g, "")) || 0;
            const carbsValue =
              parseFloat(item.carbs.replace(/[^0-9.-]+/g, "")) || 0;
            const fatValue =
              parseFloat(item.fat?.replace(/[^0-9.-]+/g, "")) || 0;

            acc.calories += Number(item.calories) || 0;
            acc.protein += proteinValue;
            acc.carbs += carbsValue;
            acc.fat += fatValue;
          });
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        date: format(day, "EEE"),
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fat: Math.round(totals.fat),
      };
    });
  };

  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  const handleCurrentWeek = () => {
    setSelectedDate(new Date());
  };

  const handleDayClick = (day) => {
    const weekStart = startOfWeek(selectedDate);
    const dayIndex = weeklyData.findIndex((d) => d.date === day);
    if (dayIndex !== -1) {
      const newDate = new Date(weekStart);
      newDate.setDate(weekStart.getDate() + dayIndex);
      setSelectedDate(newDate);
    }
  };

  const handleDailyDateChange = (event) => {
    const selectedDate = event.target.value;
    // Create date in local timezone to avoid UTC conversion issues
    const newDate = new Date(selectedDate + "T00:00:00");
    setSelectedDailyDate(newDate);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const weekRange = `${format(startOfWeek(selectedDate), "MMM d")} - ${format(
    endOfWeek(selectedDate),
    "MMM d"
  )}`;
  const selectedDayStr = format(selectedDate, "MMMM d, yyyy");

  const chartData = {
    labels: weeklyData.map((data) => data.date),
    datasets: [
      {
        label: "Calories",
        data: weeklyData.map((data) => data.calories),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
      {
        label: "Protein (g)",
        data: weeklyData.map((data) => data.protein),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
      {
        label: "Carbs (g)",
        data: weeklyData.map((data) => data.carbs),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: "Fat (g)",
        data: weeklyData.map((data) => data.fat || 0),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgb(153, 102, 255)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Nutritional Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="nutritional-tracking">
      <div className="chart-container">
        <div className="chart-header">
          <h2>Weekly Nutritional Overview</h2>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek} className="nav-button">
              Previous Week
            </button>
            <span className="week-range">{weekRange}</span>
            <button onClick={handleNextWeek} className="nav-button">
              Next Week
            </button>
            <button onClick={handleCurrentWeek} className="nav-button">
              Current Week
            </button>
          </div>
        </div>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="daily-overview">
        <div className="daily-header">
          <h2>Daily Nutritional Overview</h2>
          <div className="date-selector">
            <input
              type="date"
              value={format(selectedDailyDate, "yyyy-MM-dd")}
              onChange={handleDailyDateChange}
              className="date-input"
            />
          </div>
        </div>
        <div className="selected-date">
          {format(selectedDailyDate, "MMMM d, yyyy")}
        </div>
        <div className="meals-grid">
          {dailyMeals.map((meal, index) => {
            const totals = meal.food_items.reduce(
              (acc, item) => {
                const proteinValue =
                  parseFloat(item.protein.replace(/[^0-9.-]+/g, "")) || 0;
                const carbsValue =
                  parseFloat(item.carbs.replace(/[^0-9.-]+/g, "")) || 0;

                acc.calories += Number(item.calories) || 0;
                acc.protein += proteinValue;
                acc.carbs += carbsValue;
                return acc;
              },
              { calories: 0, protein: 0, carbs: 0 }
            );

            return (
              <div key={index} className="meal-card">
                <h3>{meal.meal_type}</h3>
                <div className="nutrition-info">
                  <span>Calories: {Math.round(totals.calories)}</span>
                  <span>Protein: {Math.round(totals.protein)}g</span>
                  <span>Carbs: {Math.round(totals.carbs)}g</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NutritionalTracking;
