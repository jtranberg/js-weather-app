- Express
- NOAA CSV ingestion + parsing
- In-memory caching layer

### APIs
- OpenWeather API
- NOAA CO₂ dataset

---

## 🧪 Testing

Multi-layer testing strategy:

| Layer        | Coverage |
|--------------|---------|
| Unit         | ✅ Logic + utilities |
| Components   | ✅ UI + interaction |
| Integration  | ✅ Full app flow |
| Backend      | ✅ API + parsing + cache |


Test Suites: 11 passed
Tests: 58 passed


---

## ⚙️ Scripts

### Frontend

```bash
npm start
npm test
Backend
cd server
npm install
npm start

Runs on:
👉 http://localhost:5000

Endpoint:

GET /api/global-co2
🔑 Environment Variables

Create .env:

REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
🧠 Architecture
User Input
   ↓
API Calls (Weather / CO / CO₂ / AQI)
   ↓
Data Processing Layer
   ↓
Interpretation Engine
   ↓
UI Rendering + Advisory System
🚀 Future Improvements
CO₂ historical charts
Air quality alerts
Mobile-first UI
PWA support
Real-time streaming
🧨 Final Note

This is not just a weather app.

It is an environmental intelligence system built to make invisible atmospheric data understandable.

👨‍💻 Author

Full-stack systems builder specializing in:

End-to-end architecture
Real-world data systems
Environmental + telemetry platforms
AI-assisted interfaces

---

# 🔥 Bonus (optional but powerful)

If you want it to look even better:

### Add repo badge
```md
![GitHub Repo stars](https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO)
🎯 Result

After this:

Screenshot works ✅
Clean sections ✅
Badges at top ✅
Recruiter-friendly ✅
Portfolio-level presentation ✅