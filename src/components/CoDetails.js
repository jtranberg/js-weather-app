import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/CoDetails.css';

const API_KEY =
  process.env.REACT_APP_OPENWEATHER_API_KEY || 'f7016d740da7c098b97c1e4f547188b7';

function getCOLevel(co) {
  if (co < 4400) {
    return {
      label: 'Very Low',
      className: 'level-good',
      advisory: 'Clean air. No immediate carbon monoxide concern detected.',
    };
  } else if (co < 9400) {
    return {
      label: 'Low',
      className: 'level-fair',
      advisory: 'Air quality is acceptable for most people.',
    };
  } else if (co < 17000) {
    return {
      label: 'Moderate',
      className: 'level-moderate',
      advisory: 'Sensitive individuals should reduce prolonged outdoor exposure.',
    };
  } else if (co < 34000) {
    return {
      label: 'High',
      className: 'level-poor',
      advisory: 'Extended exposure may cause symptoms in some people.',
    };
  } else {
    return {
      label: 'Very High',
      className: 'level-hazard',
      advisory: 'Potentially dangerous carbon monoxide levels. Limit exposure.',
    };
  }
}

function getBarPosition(co) {
  const max = 40000;
  const clamped = Math.min(Math.max(Number(co) || 0, 0), max);
  return (clamped / max) * 100;
}

function CoDetails({ lat, lon }) {
  const [coData, setCoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lat == null || lon == null) {
      setError('Missing coordinates for CO lookup.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchCoData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/air_pollution',
          {
            params: {
              lat,
              lon,
              appid: API_KEY,
            },
          }
        );

        console.log('CO API response:', response.data);

        const firstEntry = response?.data?.list?.[0];
        const coValue = firstEntry?.components?.co;

        if (typeof coValue !== 'number' || Number.isNaN(coValue)) {
          throw new Error('CO value missing or invalid in API response.');
        }

        if (!cancelled) {
          setCoData(coValue);
        }
      } catch (err) {
        console.error('CO fetch error:', err);

        let message = 'Failed to fetch CO data.';

        if (err.response) {
          message = `CO request failed: ${err.response.status} ${err.response.statusText}`;
        } else if (err.request) {
          message = 'CO request was sent but no response was received.';
        } else if (err.message) {
          message = err.message;
        }

        if (!cancelled) {
          setError(message);
          setCoData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCoData();

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="glass-card co-details">
        <div className="co-header">
          <div>
            <p className="section-label mb-1">Gas Monitoring</p>
            <h3 className="panel-title mb-0">Carbon Monoxide (CO)</h3>
          </div>
        </div>
        <p>Loading CO data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card co-details">
        <div className="co-header">
          <div>
            <p className="section-label mb-1">Gas Monitoring</p>
            <h3 className="panel-title mb-0">Carbon Monoxide (CO)</h3>
          </div>
        </div>
        <p className="text-warning">{error}</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>
          Lat: {String(lat)} | Lon: {String(lon)}
        </p>
      </div>
    );
  }

  if (coData == null) {
    return (
      <div className="glass-card co-details">
        <div className="co-header">
          <div>
            <p className="section-label mb-1">Gas Monitoring</p>
            <h3 className="panel-title mb-0">Carbon Monoxide (CO)</h3>
          </div>
        </div>
        <p>No CO data available.</p>
      </div>
    );
  }

  const level = getCOLevel(coData);
  const position = getBarPosition(coData);

  return (
    <div className="glass-card co-details">
      <div className="co-header">
        <div>
          <p className="section-label mb-1">Gas Monitoring</p>
          <h3 className="panel-title mb-0">Carbon Monoxide (CO)</h3>
        </div>

        <span className={`status-badge ${level.className}`}>
          {level.label}
        </span>
      </div>

      <div className="co-value">
        {Number(coData).toFixed(0)} <span>µg/m³</span>
      </div>

      <div className="measure-bar">
        <div
          className="level-indicator"
          style={{ left: `${position}%` }}
        />
      </div>

      <p className="co-advisory">{level.advisory}</p>
    </div>
  );
}

export default CoDetails;