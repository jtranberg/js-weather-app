import React, { useMemo } from 'react';
import './css/Co2EraComparison.css';

const PRE_INDUSTRIAL_CO2 = 280;
const DINOSAUR_REFERENCE_CO2 = 1500;

function getModernDeltaLevel(delta) {
  if (delta < 50) {
    return {
      label: 'Near historical baseline',
      className: 'delta-good',
      note: 'Atmospheric CO₂ remains relatively close to older baseline conditions.',
    };
  }

  if (delta < 120) {
    return {
      label: 'Above historical baseline',
      className: 'delta-fair',
      note: 'CO₂ is above pre-industrial background levels, but not dramatically so.',
    };
  }

  if (delta < 200) {
    return {
      label: 'Elevated from past',
      className: 'delta-moderate',
      note: 'Modern atmospheric CO₂ is clearly above the pre-industrial baseline.',
    };
  }

  return {
    label: 'Modern high',
    className: 'delta-poor',
    note: 'Today’s CO₂ is well above pre-industrial levels by modern historical comparison.',
  };
}

function clampBar(value, min, max) {
  const clamped = Math.min(Math.max(value, min), max);
  return ((clamped - min) / (max - min)) * 100;
}

function Co2EraComparison({ currentCO2 }) {
  const deltaFromPast = useMemo(() => {
    if (typeof currentCO2 !== 'number') return null;
    return +(currentCO2 - PRE_INDUSTRIAL_CO2).toFixed(2);
  }, [currentCO2]);

  const percentAbovePast = useMemo(() => {
    if (typeof currentCO2 !== 'number') return null;
    return +(((currentCO2 - PRE_INDUSTRIAL_CO2) / PRE_INDUSTRIAL_CO2) * 100).toFixed(1);
  }, [currentCO2]);

  const dinosaurRatio = useMemo(() => {
    if (typeof currentCO2 !== 'number') return null;
    return +((currentCO2 / DINOSAUR_REFERENCE_CO2) * 100).toFixed(1);
  }, [currentCO2]);

  const level = useMemo(() => {
    if (deltaFromPast == null) return null;
    return getModernDeltaLevel(deltaFromPast);
  }, [deltaFromPast]);

  if (typeof currentCO2 !== 'number') {
    return (
      <div className="glass-card co2-era-comparison">
        <h3 className="panel-title mb-0">CO₂ Through Time</h3>
        <p className="mt-2 mb-0">Waiting for current global CO₂ data...</p>
      </div>
    );
  }

  if (!level) {
    return null;
  }

  const min = 200;
  const max = 1800;

  const preIndustrialPos = clampBar(PRE_INDUSTRIAL_CO2, min, max);
  const currentPos = clampBar(currentCO2, min, max);
  const dinosaurPos = clampBar(DINOSAUR_REFERENCE_CO2, min, max);

  return (
    <div className="glass-card co2-era-comparison">
      <div className="comparison-header">
        <div>
          <p className="section-label mb-1">Historical Context</p>
          <h3 className="panel-title mb-0">CO₂ Through Time</h3>
        </div>

        <span className={`status-badge ${level.className}`}>
          <span className="badge-icon">
            {level.className === 'delta-good' && '🟢'}
            {level.className === 'delta-fair' && '🔵'}
            {level.className === 'delta-moderate' && '🟡'}
            {level.className === 'delta-poor' && '🟠'}
          </span>
          {level.label}
        </span>
      </div>

      <div className="era-rows">
        <div className="era-row">
          <div className="era-label">Pre-Industrial Baseline</div>
          <div className="era-value">280 <span>ppm</span></div>
          <div className="era-note">
            Approximate background level before modern industrial emissions.
          </div>
        </div>

        <div className="era-row current-row">
          <div className="era-label">Today</div>
          <div className="era-value">{currentCO2.toFixed(2)} <span>ppm</span></div>
          <div className="era-note">
            Current global atmospheric baseline from Mauna Loa data.
          </div>
        </div>

        <div className="era-row">
          <div className="era-label">Deep-Past Reference</div>
          <div className="era-value">~1500 <span>ppm</span></div>
          <div className="era-note">
            Some prehistoric periods had much higher CO₂ under very different planetary conditions.
          </div>
        </div>
      </div>

      <div className="comparison-bar-wrap">
        <div className="comparison-bar">
          <div
            className="comparison-marker preindustrial-marker"
            style={{ left: `${preIndustrialPos}%` }}
            title="Pre-Industrial Baseline"
          />
          <div
            className="comparison-marker current-marker"
            style={{ left: `${currentPos}%` }}
            title="Today"
          />
          <div
            className="comparison-marker dinosaur-marker"
            style={{ left: `${dinosaurPos}%` }}
            title="Deep-Past Reference"
          />
        </div>

        <div className="comparison-legend">
          <span><i className="legend-dot preindustrial-dot" /> Pre-industrial</span>
          <span><i className="legend-dot current-dot" /> Today</span>
          <span><i className="legend-dot dinosaur-dot" /> Deep past</span>
        </div>
      </div>

      <div className="comparison-stats">
        <div className="comparison-stat">
          <div className="comparison-stat-label">Increase from Past</div>
          <div className="comparison-stat-value">+{deltaFromPast.toFixed(2)} ppm</div>
        </div>

        <div className="comparison-stat">
          <div className="comparison-stat-label">Percent Above Past</div>
          <div className="comparison-stat-value">+{percentAbovePast}%</div>
        </div>

        <div className="comparison-stat">
          <div className="comparison-stat-label">Today vs Deep Past</div>
          <div className="comparison-stat-value">{dinosaurRatio}%</div>
        </div>
      </div>

      <p className="comparison-note mb-0">
        {level.note} Higher CO₂ supported different ancient ecosystems, but those worlds also had very different temperatures, oceans, and life systems.
      </p>
    </div>
  );
}

export default Co2EraComparison;