import React from 'react';
import moment from 'moment';

function ForecastDisplay({ data }) {
  return (
    <div className="forecast-info">
      <h3>Forecast</h3>
      {data.list.slice(0, 5).map((item, index) => (
        <div key={index}>
          <p>{moment(item.dt_txt).format('MMMM Do YYYY, h:mm a')}</p>
          <p>Temperature: {item.main.temp}°</p>
          <p>Conditions: {item.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
}

export default ForecastDisplay;
