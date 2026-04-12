import React, { useState, useEffect, useMemo } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import HistoryModal from './components/HistoryModal';
import CoDetails from './components/CoDetails';
import Co2Details from './components/Co2Details';
import Co2EraComparison from './components/Co2EraComparison';
import AtmosphereSummary from './components/AtmosphereSummary';
import AirQualityPanel from './components/AirQualityPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBackgroundForTime } from './components/background';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(getBackgroundForTime());
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    const updateBackground = () => {
      setBackgroundImage(getBackgroundForTime());
    };

    updateBackground();

    const interval = setInterval(updateBackground, 3600000);

    return () => clearInterval(interval);
  }, []);

  const addToHistory = (location) => {
    setSearchHistory((prevHistory) => {
      const cleaned = prevHistory.filter((item) => item !== location);
      return [location, ...cleaned].slice(0, 10);
    });
  };

  const toggleForecast = () => {
    setShowForecast((prev) => !prev);
  };

  const coordinates = useMemo(() => {
    if (!weatherData?.coord) return null;

    return {
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
    };
  }, [weatherData]);

  return (
    <div className="app-shell">
  <div
    className="app-background"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  />
  <div className="app-overlay">
        <div className="container py-4">
          <div className="weather-app-content">
            <header className="text-center mb-4">
              <h1 className="app-title">Brave Enough To Breathe</h1>
              <p className="app-subtitle">
                Real-time atmospheric conditions, forecasts, and breathing intelligence.
              </p>
            </header>

            <WeatherForm
              setWeatherData={setWeatherData}
              setForecastData={setForecastData}
              addToHistory={addToHistory}
            />

            <HistoryModal
              history={searchHistory}
              setWeatherData={setWeatherData}
            />

            {weatherData && (
              <AtmosphereSummary weatherData={weatherData} />
            )}

            {forecastData && (
              <div className="text-center my-3">
                <button
                  className="btn btn-primary forecast-toggle-btn"
                  onClick={toggleForecast}
                >
                  {showForecast ? 'Hide Forecast' : 'Show Forecast'}
                </button>
              </div>
            )}

            {showForecast && forecastData && (
              <ForecastDisplay data={forecastData} />
            )}

            {weatherData && (
              <WeatherDisplay data={weatherData} />
            )}

            {coordinates && (
              <section className="air-grid mt-4">
                <CoDetails
                  lat={coordinates.lat}
                  lon={coordinates.lon}
                />

                <Co2Details
                  lat={coordinates.lat}
                  lon={coordinates.lon}
                  weatherData={weatherData}
                />

                <AirQualityPanel
                  lat={coordinates.lat}
                  lon={coordinates.lon}
                />
                <Co2EraComparison currentCO2={431.83} />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;