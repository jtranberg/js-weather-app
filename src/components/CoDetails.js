import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/CoDetails.css'; // Import the CSS file for the measure bar

function CoDetails({ lat, lon }) {
  const [coData, setCoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levelDescription, setLevelDescription] = useState('');
  const [levelClass, setLevelClass] = useState('');

  useEffect(() => {
    const fetchCoData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution`, {
          params: {
            lat: lat,
            lon: lon,
            appid: 'f7016d740da7c098b97c1e4f547188b7', // Replace with your OpenWeather API key
          },
        });
        const coValue = response.data.list[0].components.co;
        setCoData(coValue);
        setLoading(false);

        // Determine the level description and CSS class based on the CO concentration
        if (coValue < 10305) {
          setLevelDescription('Extremely Low');
          setLevelClass('level-extremely-low');
        } else if (coValue < 57250) {
          setLevelDescription('Low');
          setLevelClass('level-low');
        } else if (coValue < 229000) {
          setLevelDescription('Moderate');
          setLevelClass('level-moderate');
        } else if (coValue < 458000) {
          setLevelDescription('High');
          setLevelClass('level-high');
        } else {
          setLevelDescription('Extremely High');
          setLevelClass('level-extremely-high');
        }
      } catch (err) {
        setError('Failed to fetch CO data');
        setLoading(false);
      }
    };

    fetchCoData();
  }, [lat, lon]);

  if (loading) return <p>Loading CO data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="co-details">
      <h2>Carbon Monoxide (CO) Levels</h2>
      <p>CO Concentration: {coData} µg/m³</p>
      <div className={`measure-bar ${levelClass}`}>
        <div className="level-indicator"></div>
      </div>
      <p>Level: {levelDescription}</p>
      
    </div>
  );
}

export default CoDetails;


//f7016d740da7c098b97c1e4f547188b7