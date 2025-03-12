import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GutHealthAI = () => {
  const [diet, setDiet] = useState("vegan");
  const [gutHealth, setGutHealth] = useState("moderate");
  const [goal, setGoal] = useState("muscle gain");
  const [day, setDay] = useState(1);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_meal_plan", {
        dietary_preferences: diet,
        gut_health_score: gutHealth,
        fitness_goal: goal,
        day: day,
      });
      setMealPlan(response.data);
    } catch (err) {
      setError("Failed to fetch meal plan");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Gut Health AI Meal Planner</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          placeholder="Diet (e.g., vegan, keto)"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={gutHealth}
          onChange={(e) => setGutHealth(e.target.value)}
          placeholder="Gut Health Score (poor, moderate, good)"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Fitness Goal"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={day}
          min="1"
          max="7"
          onChange={(e) => setDay(Number(e.target.value))}
          placeholder="Day (1-7)"
          className="p-2 border rounded"
        />
      </div>
      <Button onClick={fetchMealPlan} disabled={loading}>
        {loading ? "Generating..." : "Generate Meal Plan"}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {mealPlan && (
        <Card className="mt-6 w-full max-w-2xl">
          <CardContent>
            <h2 className="text-xl font-semibold">Meal Plan for Day {mealPlan.day}</h2>
            <ul className="list-disc ml-6">
              {mealPlan.meal_plan.map((meal, index) => (
                <li key={index}>{meal}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-4">Nutritional Information:</h3>
            {Object.entries(mealPlan.nutritional_info).map(([meal, nutrients], index) => (
              <div key={index} className="mt-2">
                <p className="font-semibold">{meal}</p>
                <ul className="list-disc ml-6">
                  {Object.entries(nutrients).map(([key, value]) => (
                    <li key={key}>{key}: {value}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GutHealthAI;
