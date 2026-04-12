🌍 Be Brave To Breathe

Real-time atmospheric intelligence platform combining weather data, air quality metrics, and global CO₂ insights into a single unified dashboard.

🧠 Overview

Be Brave To Breathe is a full-stack system designed to transform raw environmental data into actionable insight.

It integrates:

🌤️ Live weather conditions
🌫️ Air quality & pollutant analysis
🧪 Carbon monoxide (CO) levels
🌎 Global CO₂ trends (NOAA data)
🧭 Atmospheric interpretation & advisories

The goal is simple:

Turn environmental data → insight → awareness → better decisions

🚀 Features
🌤️ Weather Intelligence
Real-time weather lookup by city & country
Temperature, humidity, wind, and conditions
Dynamic atmospheric summaries
🌫️ Air Quality Panel
AQI classification (Good → Hazard)
Pollutant breakdown:
PM2.5
PM10
NO₂, O₃, SO₂, CO
Human-readable explanations
🧪 CO Monitoring
Carbon monoxide concentration analysis
Health interpretation layers
🌎 Global CO₂ Tracking
Live NOAA Mauna Loa data
Daily CO₂ change tracking
Trend detection (rising / falling / stable)
Cached backend API for performance
🧭 Atmospheric Summary Engine
Interprets conditions into:
Stable
Humid
Windy
Reduced Clarity
Provides breathing advisories
📊 Forecast View
Time-based forecast breakdown
Moment.js formatted timestamps
🕘 Search History
Modal-based history tracking
Quick re-selection of past searches
🧰 Tech Stack
Frontend
React (Create React App)
React Bootstrap
Testing Library
Backend
Node.js + Express
NOAA CO₂ data ingestion (CSV parsing)
Caching layer
APIs
OpenWeather API
NOAA Global CO₂ dataset
🧪 Testing

This project includes a full multi-layer testing strategy:

✅ Unit Tests
Utility functions
Data transformation logic
✅ Component Tests
UI rendering
User interaction
Conditional states
✅ Integration Tests
Full app flow:
User input → API → UI update
Multi-API mocking (axios + fetch)
✅ Backend Tests
Express API routes
CSV parsing validation
Cache behavior
Error handling
Test Suites: 11 passed
Tests:       58 passed
⚙️ Available Scripts
npm start

Run the frontend in development mode
👉 http://localhost:3000

npm test

Run all frontend tests

🔧 Backend (CO₂ Server)

Navigate to the server folder:

cd server
npm install
npm start

Runs on:
👉 http://localhost:5000

Endpoint:

GET /api/global-co2
🔑 Environment Variables

Create a .env file in the root:

REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
📸 Screenshot

Placed in:

public/screenshot.png
🎯 System Design Philosophy

This project is built around:

data → processing → insight → action

Not just displaying data —
but making it understandable and meaningful.

🧠 Author

Built by a full-stack systems engineer focused on:

End-to-end system design
Real-world data handling
Predictive & interpretive interfaces
IoT, telemetry, and environmental systems
🚀 Future Improvements
Historical CO₂ visualization charts
Alert thresholds for air quality
Mobile optimization
PWA support
Real-time streaming updates
🧨 Final Note

This is not just a weather app.

It’s an environmental intelligence system.