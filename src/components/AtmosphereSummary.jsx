import React from 'react';

function getTimeOfDayLabel(iconCode = '') {
  return iconCode.includes('n') ? 'Night Conditions' : 'Day Conditions';
}

function getSummaryLevel(weatherData) {
  const humidity = weatherData?.main?.humidity ?? 0;
  const wind = weatherData?.wind?.speed ?? 0;
  const temp = weatherData?.main?.temp ?? 0;
  const condition = weatherData?.weather?.[0]?.main?.toLowerCase() || '';

  if (condition.includes('smoke') || condition.includes('haze')) {
    return {
      label: 'Reduced Clarity',
      className: 'level-poor',
      advisory:
        'Reduced air clarity detected. Sensitive groups should limit prolonged outdoor exposure.',
    };
  }

  if (condition.includes('rain') || condition.includes('drizzle')) {
    return {
      label: 'Moist Conditions',
      className: 'level-fair',
      advisory:
        'Moisture-rich air conditions. Outdoor air may feel cooler and heavier.',
    };
  }

  if (humidity > 80) {
    return {
      label: 'Humid',
      className: 'level-moderate',
      advisory:
        'High humidity may make the air feel heavier and less comfortable to breathe.',
    };
  }

  if (temp > 30) {
    return {
      label: 'Hot',
      className: 'level-moderate',
      advisory:
        'Hot outdoor conditions. Hydration and reduced exertion may be wise.',
    };
  }

  if (wind > 10) {
    return {
      label: 'Windy',
      className: 'level-fair',
      advisory:
        'Windy conditions may help disperse local pollutants, but can also stir particulates.',
    };
  }

  return {
    label: 'Stable',
    className: 'level-good',
    advisory:
      'Atmospheric conditions currently appear stable for most normal outdoor activity.',
  };
}

function getBadgeIcon(className) {
  switch (className) {
    case 'level-good':
      return '🟢';
    case 'level-fair':
      return '🔵';
    case 'level-moderate':
      return '🟡';
    case 'level-poor':
      return '🟠';
    case 'level-hazard':
      return '🔴';
    default:
      return '⚪';
  }
}

const AtmosphereSummary = ({ weatherData }) => {
  if (!weatherData) return null;

  const city = weatherData?.name || 'Unknown Location';
  const country = weatherData?.sys?.country || '';
  const temp = weatherData?.main?.temp ?? 0;
  const feelsLike = weatherData?.main?.feels_like ?? 0;
  const humidity = weatherData?.main?.humidity ?? 0;
  const pressure = weatherData?.main?.pressure ?? 0;
  const wind = weatherData?.wind?.speed ?? 0;
  const weather = weatherData?.weather?.[0]?.main || 'Unknown';
  const description = weatherData?.weather?.[0]?.description || '';
  const icon = weatherData?.weather?.[0]?.icon || '';

  const timeOfDay = getTimeOfDayLabel(icon);
  const level = getSummaryLevel(weatherData);

  return (
    <div className="glass-card atmosphere-summary mb-4">
      <div className="summary-top">
        <div>
          <p className="section-label">Atmospheric Snapshot</p>
          <h2 className="summary-location">
            {city}
            {country ? `, ${country}` : ''}
          </h2>
          <p className="summary-condition">
            {weather} • {description}
          </p>
        </div>

        <div className="summary-temp-block">
          <span className={`status-badge ${level.className}`}>
            <span className="badge-icon">{getBadgeIcon(level.className)}</span>
            {level.label}
          </span>

          <div className="summary-temp">
            {Math.round(temp)}°C
          </div>
          <div className="summary-feels-like">
            Feels like {Math.round(feelsLike)}°C
          </div>
        </div>
      </div>

      <div className="summary-metrics">
        <div className="metric-pill">
          <span className="metric-label">Humidity</span>
          <span className="metric-value">{humidity}%</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Wind</span>
          <span className="metric-value">{wind} m/s</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Pressure</span>
          <span className="metric-value">{pressure} hPa</span>
        </div>

        <div className="metric-pill">
          <span className="metric-label">Cycle</span>
          <span className="metric-value">{timeOfDay}</span>
        </div>
      </div>

      <div className="summary-advisory mt-3">
        <p className="section-label mb-1">Breathing Advisory</p>
        <p className="mb-0">{level.advisory}</p>
      </div>
    </div>
  );
};

export default AtmosphereSummary;