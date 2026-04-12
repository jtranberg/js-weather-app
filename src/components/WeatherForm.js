import React, { useState } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

function WeatherForm({ setWeatherData, setForecastData, addToHistory }) {
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [unit, setUnit] = useState('metric');

  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
      const response = await axios.get(url);

      setWeatherData(response.data);
      setLocation(response.data.name);
      setCountryCode(response.data.sys.country);
      addToHistory(`${response.data.name}, ${response.data.sys.country}`);
    } catch (error) {
      alert('Failed to fetch weather data.');
    }
  };

  const fetchWeatherDataByLocation = async () => {
    if (!location || !countryCode) {
      alert('Please enter both location and country code.');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location},${countryCode}&units=${unit}&appid=${API_KEY}`;
      const response = await axios.get(url);

      setWeatherData(response.data);
      addToHistory(`${response.data.name}, ${response.data.sys.country}`);
    } catch (error) {
      alert('Failed to fetch weather data.');
    }
  };

  const fetchForecastData = async () => {
    if (!location || !countryCode) {
      alert('Please enter both location and country code.');
      return;
    }

    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location},${countryCode}&units=${unit}&appid=${API_KEY}`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      alert('Failed to fetch forecast data.');
    }
  };

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      default:
        alert('An unknown error occurred.');
        break;
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
      },
      handleLocationError
    );
  };

  return (
    <div className="glass-card weather-form-card mb-3">
      <div className="weather-form-grid">
        <input
          type="text"
          className="form-control weather-form-input"
          placeholder="Enter city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          className="form-control weather-form-input"
          placeholder="Enter country code (e.g. CA)"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        />

        <select
          className="form-select weather-form-input"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>

        <button className="btn btn-primary weather-form-btn" onClick={getLocation}>
          Current Location
        </button>

        <button className="btn btn-secondary weather-form-btn" onClick={fetchForecastData}>
          Show Forecast
        </button>

        <button className="btn btn-info weather-form-btn" onClick={fetchWeatherDataByLocation}>
          Get Weather
        </button>
      </div>
    </div>
  );
}

export default WeatherForm;