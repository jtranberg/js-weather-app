import React, { useState, useEffect } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import HistoryModal from './components/HistoryModal';
import CoDetails from './components/CoDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getBackgroundForTime } from './components/background';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(getBackgroundForTime());
  const [showForecast, setShowForecast] = useState(false); // State for toggling forecast

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundImage(getBackgroundForTime());
    }, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  const addToHistory = (location) => {
    setSearchHistory((prevHistory) => [location, ...prevHistory]);
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  return (
    <div 
      className="container" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <h1 className="text-center">Be Brave To Breath</h1>
      <WeatherForm 
        setWeatherData={setWeatherData} 
        setForecastData={setForecastData} 
        addToHistory={addToHistory} 
      />
      <HistoryModal history={searchHistory} setWeatherData={setWeatherData} />{forecastData && (
        <>
          <button 
            className="btn btn-primary my-3" 
            onClick={toggleForecast}
          >
            {showForecast ? 'Hide Forecast' : 'Show Forecast'}
          </button>
          {showForecast && <ForecastDisplay data={forecastData} />}
        </>
      )}
      {weatherData && <WeatherDisplay data={weatherData} />}
      
      

      {weatherData && (
        <CoDetails lat={weatherData.coord.lat} lon={weatherData.coord.lon} />
      )}
    </div>
  );
}

export default App;
