import React, { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

function getAQILevel(aqi) {
  switch (aqi) {
    case 1:
      return { label: 'Good', className: 'level-good' };
    case 2:
      return { label: 'Fair', className: 'level-fair' };
    case 3:
      return { label: 'Moderate', className: 'level-moderate' };
    case 4:
      return { label: 'Poor', className: 'level-poor' };
    case 5:
      return { label: 'Very Poor', className: 'level-hazard' };
    default:
      return { label: 'Unknown', className: 'level-neutral' };
  }
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

function getPollutantMeaning(key, value) {
  const rounded = value?.toFixed?.(1) ?? value;

  switch (key) {
    case 'pm2_5':
      return `${rounded} μg/m³ • Fine particles that can penetrate deep into the lungs.`;
    case 'pm10':
      return `${rounded} μg/m³ • Larger airborne particles such as dust and smoke.`;
    case 'no2':
      return `${rounded} μg/m³ • Nitrogen dioxide linked to traffic and combustion sources.`;
    case 'o3':
      return `${rounded} μg/m³ • Ground-level ozone can irritate the respiratory system.`;
    case 'so2':
      return `${rounded} μg/m³ • Sulfur dioxide from industrial and fuel-burning sources.`;
    case 'co':
      return `${rounded} μg/m³ • Carbon monoxide associated with incomplete combustion.`;
    default:
      return `${rounded}`;
  }
}

const AirQualityPanel = ({ lat, lon }) => {
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lat || !lon || !API_KEY) return;

    const fetchAirQuality = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch air quality data.');
        }

        const data = await response.json();
        setAirData(data?.list?.[0] || null);
      } catch (err) {
        setError(err.message || 'Unable to load air quality data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [lat, lon]);

  if (!API_KEY) {
    return (
      <div className="glass-card air-panel">
        <h3 className="panel-title">Air Quality Panel</h3>
        <p className="mb-0">
          Missing OpenWeather API key. Add <code>REACT_APP_OPENWEATHER_API_KEY</code>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-card air-panel">
        <h3 className="panel-title">Air Quality Panel</h3>
        <p className="mb-0">Loading atmospheric pollutants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card air-panel">
        <h3 className="panel-title">Air Quality Panel</h3>
        <p className="mb-0 text-warning">{error}</p>
      </div>
    );
  }

  if (!airData) {
    return null;
  }

  const aqiLevel = getAQILevel(airData.main?.aqi);
  const components = airData.components || {};

  const pollutantEntries = [
    ['pm2_5', components.pm2_5],
    ['pm10', components.pm10],
    ['no2', components.no2],
    ['o3', components.o3],
    ['so2', components.so2],
    ['co', components.co],
  ];

  return (
    <div className="glass-card air-panel">
      <div className="comparison-header">
        <div>
          <p className="section-label mb-1">Environmental Intelligence</p>
          <h3 className="panel-title mb-0">Air Quality Panel</h3>
        </div>

        <span className={`status-badge ${aqiLevel.className}`}>
          <span className="badge-icon">{getBadgeIcon(aqiLevel.className)}</span>
          AQI: {aqiLevel.label}
        </span>
      </div>

      <div className="pollutant-grid">
        {pollutantEntries.map(([key, value]) => (
          <div key={key} className="pollutant-card">
            <div className="pollutant-name">{key.toUpperCase()}</div>
            <div className="pollutant-reading">
              {typeof value === 'number' ? value.toFixed(1) : '--'}
            </div>
            <div className="pollutant-desc">
              {getPollutantMeaning(key, value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityPanel;