import React, { useEffect, useMemo, useState } from 'react';
import './css/Co2Details.css';

 const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function getCO2Level(value) {
  if (value < 410) {
    return {
      label: 'Near baseline',
      className: 'level-good',
      advisory: 'Close to modern baseline atmospheric levels.',
    };
  }

  if (value < 425) {
    return {
      label: 'Above baseline',
      className: 'level-fair',
      advisory: 'Slightly above long-term background levels.',
    };
  }

  if (value < 445) {
    return {
      label: 'Elevated',
      className: 'level-moderate',
      advisory: 'Global CO₂ is elevated compared to historical norms.',
    };
  }

  return {
    label: 'Modern high',
    className: 'level-poor',
    advisory: 'CO₂ levels are high relative to the modern historical range.',
  };
}

function getBarPosition(value) {
  const min = 380;
  const max = 450;
  const clamped = Math.min(Math.max(Number(value) || min, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

function formatSourceDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getTrendDisplay(change) {
  if (typeof change !== 'number' || Number.isNaN(change)) {
    return {
      icon: '→',
      label: 'stable',
      colorClass: 'trend-stable',
      formattedChange: '0.00',
    };
  }

  if (change > 0) {
    return {
      icon: '↑',
      label: 'rising',
      colorClass: 'trend-rising',
      formattedChange: `+${change.toFixed(2)}`,
    };
  }

  if (change < 0) {
    return {
      icon: '↓',
      label: 'falling',
      colorClass: 'trend-falling',
      formattedChange: change.toFixed(2),
    };
  }

  return {
    icon: '→',
    label: 'stable',
    colorClass: 'trend-stable',
    formattedChange: '0.00',
  };
}

function Co2Details() {
  const [co2, setCo2] = useState(null);
  const [sourceDate, setSourceDate] = useState('');
  const [trend, setTrend] = useState('');
  const [change, setChange] = useState(null);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchCO2 = async () => {
      try {
        setLoading(true);
        setError('');

       

const res = await fetch(`${API_BASE_URL}/api/global-co2`);

        if (!res.ok) {
          throw new Error(`Failed to load CO₂: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          setCo2(data.co2);
          setSourceDate(data.date || '');
          setTrend(data.trend || '');
          setChange(typeof data.change === 'number' ? data.change : null);
          setSource(data.source || 'NOAA Mauna Loa');
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load global CO₂ data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCO2();

    return () => {
      cancelled = true;
    };
  }, []);

  const level = useMemo(() => getCO2Level(co2), [co2]);
  const position = useMemo(() => getBarPosition(co2), [co2]);
  const trendDisplay = useMemo(() => getTrendDisplay(change), [change]);
  const formattedDate = useMemo(() => formatSourceDate(sourceDate), [sourceDate]);

  if (loading) {
    return (
      <div className="glass-card co2-details">
        <h3 className="panel-title mb-0">Global CO₂</h3>
        <p>Loading global CO₂ data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card co2-details">
        <h3 className="panel-title mb-0">Global CO₂</h3>
        <p className="text-warning">{error}</p>
      </div>
    );
  }

  if (co2 == null) {
    return null;
  }

  return (
    <div className="glass-card co2-details">
      <div className="co2-header">
        <div>
          <p className="section-label mb-1">Planetary Signal</p>
          <h3 className="panel-title mb-0">Global CO₂</h3>
        </div>

      {level && (
  <span className={`status-badge ${level.className}`}>
    <span className="badge-icon">
      {level.className === 'level-good' && '🟢'}
      {level.className === 'level-fair' && '🔵'}
      {level.className === 'level-moderate' && '🟡'}
      {level.className === 'level-poor' && '🟠'}
      {level.className === 'level-hazard' && '🔴'}
    </span>
    {level.label}
  </span>
)}
      </div>

      <div className="co2-value">
        {Number(co2).toFixed(2)} <span>ppm</span>
      </div>

      <div className={`co2-trend ${trendDisplay.colorClass}`}>
        {trendDisplay.icon} {trendDisplay.formattedChange} ppm/day
        <span className="trend-label">
          {' '}({trend || trendDisplay.label})
        </span>
      </div>

      <div className="measure-bar">
        <div
          className="level-indicator"
          style={{ left: `${position}%` }}
        />
      </div>

      <p className="co2-advisory">{level.advisory}</p>

      <div className="co2-meta">
        <div><strong>Source:</strong> {source}</div>
        {formattedDate && <div><strong>Date:</strong> {formattedDate}</div>}
      </div>

      <div className="co2-note">
        CO₂ is globally mixed in the atmosphere, so this value reflects a planetary
        baseline rather than a local street-level reading.
      </div>
    </div>
  );
}

export default Co2Details;