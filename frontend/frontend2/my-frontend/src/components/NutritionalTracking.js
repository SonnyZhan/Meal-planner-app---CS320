import { useState, useEffect } from "react";
//import { Line } from "react-chartjs-2";
import {BarChart} from '@mui/x-charts/BarChart';
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
              end_date: format(weekEnd, "yyyy-MM-dd")
            },
          }
        );

        const processedData = processWeeklyData(response.data);
        setWeeklyData(processedData);
        
        // Process daily meals for the selected date
        const selectedDateStr = format(selectedDailyDate, "yyyy-MM-dd");
        const selectedDayMeals = response.data.filter(
          (item) => format(new Date(item.date), "yyyy-MM-dd") === selectedDateStr
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
      
      const dayData = data.filter(
        (item) => format(new Date(item.date), "yyyy-MM-dd") === formattedDay
      );

      const totals = dayData.reduce(
        (acc, meal) => {
          meal.food_items.forEach((item) => {
            // Protein and carbs are strings, so converted them to numbers
            const proteinValue = parseFloat(item.protein.replace(/[^0-9.-]+/g, '')) || 0;
            const carbsValue = parseFloat(item.carbs.replace(/[^0-9.-]+/g, '')) || 0;
            
            acc.calories += Number(item.calories) || 0;
            acc.protein += proteinValue;
            acc.carbs += carbsValue;
          });
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0 }
      );

      return {
        date: format(day, "EEE"),
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
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
    const dayIndex = weeklyData.findIndex(d => d.date === day);
    if (dayIndex !== -1) {
      const newDate = new Date(weekStart);
      newDate.setDate(weekStart.getDate() + dayIndex);
      setSelectedDate(newDate);
    }
  };

  const handleDailyDateChange = (event) => {
    const selectedDate = event.target.value;
    // Create date in local timezone to avoid UTC conversion issues
    const newDate = new Date(selectedDate + 'T00:00:00');
    setSelectedDailyDate(newDate);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const weekRange = `${format(startOfWeek(selectedDate), "MMM d")} - ${format(endOfWeek(selectedDate), "MMM d")}`;
  const selectedDayStr = format(selectedDate, "MMMM d, yyyy");

  return (
    <div className="nutritional-tracking">
      <div className="chart-container">
        <div className="chart-header">
          <h2>Weekly Nutritional Overview</h2>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek} className="nav-button">Previous Week</button>
            <span className="week-range">{weekRange}</span>
            <button onClick={handleNextWeek} className="nav-button">Next Week</button>
            <button onClick={handleCurrentWeek} className="nav-button">Current Week</button>
          </div>
        </div>
        <div className="chart-wrapper">
          <BarChart
            dataset={weeklyData}
            xAxis={[{ dataKey: "date", scaleType: "band" }]}
            yAxis={[
              {
                scaleType: "linear",
                min: 0,
                max: Math.max(...weeklyData.map(d => Math.max(d.calories, d.protein, d.carbs))) * 1.2,
                tickCount: 6,
                valueFormatter: (value) => {
                  if (value >= 1000) {
                    return (value / 1000).toFixed(1) + 'k';
                  }
                  return value.toString();
                }
              }
            ]}
            series={[
              { dataKey: "calories", label: "Calories", color: "#FF6384" },
              { dataKey: "protein", label: "Protein", color: "#36A2EB" },
              { dataKey: "carbs", label: "Carbohydrates", color: "#FFCE56" }
            ]}
            height={400}
            margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
          />
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
        <div className="selected-date">{format(selectedDailyDate, "MMMM d, yyyy")}</div>
        <div className="meals-grid">
          {dailyMeals.map((meal, index) => {
            const totals = meal.food_items.reduce(
              (acc, item) => {
                const proteinValue = parseFloat(item.protein.replace(/[^0-9.-]+/g, '')) || 0;
                const carbsValue = parseFloat(item.carbs.replace(/[^0-9.-]+/g, '')) || 0;
                
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