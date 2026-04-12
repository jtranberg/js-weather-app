import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());

/* -----------------------------
   CONFIG
----------------------------- */
const CO2_CSV_URL =
  'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_daily_mlo.csv';

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/* -----------------------------
   CACHE
----------------------------- */
let cache = {
  data: null,
  timestamp: 0,
};

/* -----------------------------
   HELPERS
----------------------------- */

function parseCSV(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function extractCO2Data(lines) {
  if (lines.length < 2) {
    throw new Error('Not enough data in CSV');
  }

  const latest = lines[lines.length - 1].split(',').map((v) => v.trim());
  const previous = lines[lines.length - 2].split(',').map((v) => v.trim());

  const year = latest[0];
  const month = latest[1];
  const day = latest[2];

  const co2 = parseFloat(latest[4]);
  const prevCO2 = parseFloat(previous[4]);

  if (isNaN(co2)) {
    throw new Error('Invalid CO₂ value');
  }

  const change = !isNaN(prevCO2) ? +(co2 - prevCO2).toFixed(3) : null;

  return {
    co2,
    change,
    date: formatDate(year, month, day),
  };
}

function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isCacheValid() {
  return cache.data && Date.now() - cache.timestamp < CACHE_DURATION;
}

/* -----------------------------
   ROUTE
----------------------------- */

app.get('/api/global-co2', async (req, res) => {
  try {
    if (isCacheValid()) {
      console.log('🟢 Serving CO₂ from cache');
      return res.json(cache.data);
    }

    console.log('🌍 Fetching CO₂ from NOAA...');

    const response = await fetch(CO2_CSV_URL);

    if (!response.ok) {
      throw new Error(`NOAA request failed: ${response.status}`);
    }

    const text = await response.text();
    const lines = parseCSV(text);

    const { co2, change, date } = extractCO2Data(lines);

    const result = {
      co2,
      change,
      date,
      trend:
        change > 0 ? 'rising' :
        change < 0 ? 'falling' :
        'stable',
      source: 'NOAA Mauna Loa',
    };

    // update cache
    cache = {
      data: result,
      timestamp: Date.now(),
    };

    console.log('✅ CO₂ updated:', result);

    res.json(result);
  } catch (err) {
    console.error('❌ CO₂ API error:', err.message);

    res.status(500).json({
      error: 'Failed to fetch CO₂ data',
      detail: err.message,
    });
  }
});

/* -----------------------------
   START SERVER
----------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 CO2 server running on http://localhost:${PORT}`);
});