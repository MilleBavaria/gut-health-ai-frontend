import streamlit as st
import requests

# Backend API URL
API_URL = "API_URL = "https://gut-health-ai-backend.onrender.com/generate_meal_plan"

st.title("Gut Health AI Meal Planner")

# User Inputs
diet = st.text_input("Diet (e.g., vegan, keto, balanced)", "vegan")
gut_health = st.selectbox("Gut Health Score", ["poor", "moderate", "good"])
goal = st.text_input("Fitness Goal (e.g., muscle gain, weight loss)", "muscle gain")
day = st.slider("Select Day (1-7)", 1, 7, 1)

# Submit Button
if st.button("Generate Meal Plan"):
    with st.spinner("Fetching meal plan..."):
        response = requests.post(API_URL, json={
            "dietary_preferences": diet,
            "gut_health_score": gut_health,
            "fitness_goal": goal,
            "day": day
        })
        if response.status_code == 200:
            meal_plan = response.json()
            st.subheader(f"Meal Plan for Day {meal_plan['day']}")
            st.write(meal_plan["meal_plan"])
            st.subheader("Nutritional Information")
            for meal, nutrients in meal_plan["nutritional_info"].items():
                st.write(f"**{meal}**")
                for nutrient, value in nutrients.items():
                    st.write(f"- {nutrient}: {value}")
        else:
            st.error("Failed to fetch meal plan. Try again.")
