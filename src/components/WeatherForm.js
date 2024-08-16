import React, { useState } from 'react';
import axios from 'axios';

function WeatherForm({ setWeatherData, setForecastData, addToHistory }) {
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit

  // Fetch weather data using coordinates
  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=f7016d740da7c098b97c1e4f547188b7`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      setLocation(response.data.name); // Set the location name based on response data
      setCountryCode(response.data.sys.country); // Set the country code based on response data
      addToHistory(`${response.data.name}, ${response.data.sys.country}`);
    } catch (error) {
      alert('Failed to fetch weather data.');
    }
  };

  // Fetch weather data using location and country code
  const fetchWeatherDataByLocation = async () => {
    if (!location || !countryCode) return alert('Please enter both location and country code.');
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location},${countryCode}&units=${unit}&appid=f7016d740da7c098b97c1e4f547188b7`;
      const response = await axios.get(url);
      setWeatherData(response.data);
      addToHistory(`${response.data.name}, ${response.data.sys.country}`);
    } catch (error) {
      alert('Failed to fetch weather data.');
    }
  };

  const fetchForecastData = async () => {
    if (!location || !countryCode) return alert('Please enter both location and country code.');
    try {
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location},${countryCode}&units=${unit}&appid=f7016d740da7c098b97c1e4f547188b7`
      );
      setForecastData(forecastResponse.data);
    } catch (error) {
      alert('Failed to fetch forecast data.');
    }
  };

  const handleLocationError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherDataByCoords(position.coords.latitude, position.coords.longitude);
        },
        handleLocationError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter city"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        className="form-control mt-2"
        placeholder="Enter country code (e.g., CA for Canada)"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
      />
      <div className="input-group mt-2">
        <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="metric">Celsius</option>
          <option value="imperial">Fahrenheit</option>
        </select>
        <button className="btn btn-primary" onClick={getLocation}>
          Get Current Location Weather
        </button>
        <button className="btn btn-secondary" onClick={fetchForecastData}>
          Show Forecast
        </button>
        <button className="btn btn-info" onClick={fetchWeatherDataByLocation}>
          Get Weather
        </button>
      </div>
    </div>
  );
}

export default WeatherForm;
