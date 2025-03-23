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
  //isWithinInterval,
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
        //processed weekly data takes above 2d array, and processed data turns into:
        //array with{
        //date: format(day, "EEE"),
        // ...totals,
        //};
        //here totals represents the calories proteins and carbs
        //that is stored in weekly data array
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
            acc.calories += item.calories ? item.calories : 0;
            acc.protein += parseFloat(item.protein) ? parseFloat(item.protein) : 0;
            acc.carbs += parseFloat(item.carbs)? parseFloat(item.carbs) : 0;
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

//so i will use the weekly data array to represent a bar graph
/*
  weeklyData = [
    {
      date: some formate, idk ask sonny,
      totals : {
                  calories: ,
                  protein: ,
                  carbs: 
               }
    },
    {
      date: some formate, idk ask sonny,
      totals : {
                  calories: ,
                  protein: ,
                  carbs: 
               }
    },

  ]
*/

};

export default NutritionalTracking;
