import React from 'react';

function WeatherDisplay({ data }) {
  return (
    <div className="weather-info">
      <h2>{data.name}</h2>
      <p>Temperature: {data.main.temp}°</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind Speed: {data.wind.speed} m/s</p>
      <p>Conditions: {data.weather[0].description}</p>
      <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="Weather icon" />
    </div>
  );
}

export default WeatherDisplay;
