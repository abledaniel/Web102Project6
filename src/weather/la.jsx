import React, { useEffect, useState } from 'react';
import {Outlet, Link } from 'react-router-dom';

import './weather.css';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherApi = async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=40.7143&longitude=-74.006&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index,dew_point_2m,apparent_temperature,snowfall,visibility,rain`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    };

    fetchWeatherApi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { temperature_2m, relative_humidity_2m, precipitation_probability, uv_index, dew_point_2m, apparent_temperature, snowfall, visibility, rain } = weatherData.hourly;

  return (
    <div className="weather-dashboard">
    <ul className="location-list">
      <li><Link to="/">GO BACK</Link></li>
    </ul>
    <h3>Currently the TEMPERATURE of Los Angeles is {temperature_2m[0]}°C the RELATIVE HUMIDITY is {relative_humidity_2m[0]}% the PRECIPITATION PROBABILITY is {precipitation_probability[0]}% the UV INDEX is {uv_index[0]} the DEW POINT is {dew_point_2m[0]} the APPARENT TEMPERATURE is {apparent_temperature[0]} the SNOWFALL is {snowfall[0]} the VISIBILITY is {visibility[0]} and the RAIN is {rain[0]}</h3>
    </div>
  );
};

export default WeatherDashboard;
