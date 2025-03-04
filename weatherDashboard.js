/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function WeatherDashboard() {
  const [location, setLocation] = useState({ latitude: 40.7128, longitude: -74.0060 }); // Default to NYC
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error("Weather fetch failed", error);
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  function getWeatherDescription(code) {
    const weatherCodes = {
      0: "Clear sky ☀️",
      1: "Mainly clear ⛅",
      2: "Partly cloudy 🌤️",
      3: "Overcast ☁️",
      45: "Foggy 🌫️",
      48: "Depositing rime fog 🌫️",
      51: "Light drizzle 🌧️",
      53: "Moderate drizzle 🌧️",
      55: "Dense drizzle 🌧️",
      61: "Slight rain 🌧️",
      63: "Moderate rain 🌧️",
      65: "Heavy rain 🌧️",
      80: "Light rain showers 🌦️",
      81: "Moderate rain showers 🌦️",
      82: "Violent rain showers 🌊"
    };
    return weatherCodes[code] || "Unknown conditions 🤷";
  }

  function handleLocationChange(e) {
    const [lat, lon] = e.target.value.split(',').map(coord => parseFloat(coord.trim()));
    setLocation({ latitude: lat, longitude: lon });
  }

  return (
    <div style={styles.container}>
      <h1>🌦️ Weather Dashboard</h1>
      <div style={styles.locationInput}>
        <label>
          Enter Coordinates (Lat, Lon):
          <input 
            type="text" 
            placeholder="40.7128, -74.0060" 
            onChange={handleLocationChange}
          />
        </label>
      </div>
      {loading ? (
        <p>Loading weather data...</p>
      ) : weather ? (
        <div style={styles.weatherInfo}>
          <h2>Current Weather</h2>
          <p>🌡️ Temperature: {weather.current_weather.temperature}°C</p>
          <p>🌈 Conditions: {getWeatherDescription(weather.current_weather.weathercode)}</p>
          <div style={styles.forecast}>
            <h3>Daily Forecast</h3>
            {weather.daily.time.map((date, index) => (
              <div key={date} style={styles.forecastDay}>
                <p>{new Date(date).toLocaleDateString()}</p>
                <p>🌡️ High: {weather.daily.temperature_2m_max[index]}°C</p>
                <p>🌡️ Low: {weather.daily.temperature_2m_min[index]}°C</p>
                <p>{getWeatherDescription(weather.daily.weathercode[index])}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Unable to fetch weather data</p>
      )}
      <footer style={styles.footer}>
        <a 
          href={import.meta.url.replace("esm.town", "val.town")} 
          target="_top"
          style={styles.sourceLink}
        >
          View Source
        </a>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f0f8ff',
    borderRadius: '10px'
  },
  locationInput: {
    margin: '20px 0'
  },
  weatherInfo: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  forecast: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  },
  forecastDay: {
    backgroundColor: '#e6f2ff',
    padding: '10px',
    borderRadius: '5px',
    margin: '0 5px'
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em'
  },
  sourceLink: {
    color: '#666',
    textDecoration: 'none'
  }
};

function client() {
  createRoot(document.getElementById("root")).render(<WeatherDashboard />);
}

if (typeof document !== "undefined") { client(); }

export default async function server(request: Request): Promise<Response> {
  return new Response(`
    <html>
      <head>
        <title>Weather Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="root"></div>
        <script src="https://esm.town/v/std/catch"></script>
        <script type="module" src="${import.meta.url}"></script>
      </body>
    </html>
  `, {
    headers: { "content-type": "text/html" }
  });
}
