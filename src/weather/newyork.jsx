import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Outlet, Link } from 'react-router-dom';
import './weather.css'; // CSS file

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [temperatureRange, setTemperatureRange] = useState({ min: null });

  useEffect(() => {
    const fetchWeatherApi = async () => {
      const params = {
        latitude: 40.7143,
        longitude: -74.006,
        temperature_unit: "fahrenheit",
        hourly: ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "uv_index"],
      };
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,uv_index`;
      const response = await fetch(url);
      const data = await response.json();
      setWeatherData(data);
      setLoading(false);

      const temperatureMin = Math.min(...data.hourly.temperature_2m);
      setTemperatureRange({ min: temperatureMin });
    };

    fetchWeatherApi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hourlyData = weatherData.hourly;

  // Prepare data for the chart
  const chartData = hourlyData.time.map((time, index) => ({
    time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Format as HH:MM
    temperature: hourlyData.temperature_2m[index],
  }));

  const totalItems = hourlyData.temperature_2m.length;
  const meanTemperature = hourlyData.temperature_2m.reduce((sum, temp) => sum + temp, 0) / totalItems;
  const temperatureMin = Math.min(...hourlyData.temperature_2m);
  const temperatureMax = Math.max(...hourlyData.temperature_2m);

  const filteredData = hourlyData.time.map((time, index) => {
    const currentTemperature = hourlyData.temperature_2m[index];
    const withinTemperatureRange = temperatureRange.min === null || currentTemperature >= temperatureRange.min;
    const formattedDate = new Date(time).toLocaleDateString();
    const matchesSearch = formattedDate.includes(searchTerm);

    if (matchesSearch && withinTemperatureRange) {
      return {
        time: time,
        temperature: currentTemperature,
        humidity: hourlyData.relative_humidity_2m[index],
        precipitation: hourlyData.precipitation_probability[index],
        uvIndex: hourlyData.uv_index[index]
      };
    }

    return null;
  }).filter(item => item !== null);

  return (
    <div className="weather-dashboard">
      <ul className="location-list">
      <li><Link to="/">LOS ANGELES</Link></li>
      <li><Link to="/sanfran">SAN FRANCISCO</Link></li>
    </ul>
    
      <h2>NEW YORK</h2>
      <div className="top-section">
        <div className="info-box">
          <h2>{hourlyData.temperature_2m[0]}°C</h2>
          <p>Current Temperature</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.relative_humidity_2m[0]}%</h2>
          <p>Humidity</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.precipitation_probability[0]}%</h2>
          <p>Precipitation Probability</p>
        </div>
        <div className="info-box">
          <h2>{hourlyData.uv_index[0]}</h2>
          <p>UV Index</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>SUMMARY STATISTICS</h3>
        <p>Total Items: {totalItems}</p>
        <p>Mean Temperature: {meanTemperature.toFixed(2)}°C</p>
        <p>Temperature Range: {temperatureMin}°C - {temperatureMax}°C</p>
      </div>

      <div className="chart-section">
        <h3>Temperature Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="table-section">
        <input 
          type="text" 
          placeholder="Search by Date (MM/DD)" 
          className="date-input" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        <div className="slider-container">
          <label>Minimum Temperature: {temperatureRange.min}°C</label>
          <input 
            type="range" 
            min={temperatureMin} 
            max={temperatureMax} 
            value={temperatureRange.min || temperatureMin}
            onChange={(e) => {
              const newMin = parseFloat(e.target.value);
              setTemperatureRange({ min: newMin });
            }} 
          />
        </div>
        
        <button className="search-btn" onClick={() => setSearchTerm(searchTerm)}>
          Search
        </button>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Precipitation</th>
              <th>UV Index</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.time).toLocaleString()}</td>
                <td>{entry.temperature}°C</td>
                <td>{entry.humidity}%</td>
                <td>{entry.precipitation}%</td>
                <td>{entry.uvIndex}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherDashboard;