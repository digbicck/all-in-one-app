import React, { useState, useMemo } from 'react';
import './Weather.css';

// Mock weather data for different cities
const mockWeatherData = {
  'london': {
    name: 'London',
    sys: { country: 'GB' },
    weather: [{ icon: '04d', description: 'cloudy with light rain' }],
    main: {
      temp: 18,
      feels_like: 17,
      humidity: 75,
      pressure: 1012
    },
    wind: { speed: 4.2 }
  },
  'paris': {
    name: 'Paris',
    sys: { country: 'FR' },
    weather: [{ icon: '01d', description: 'clear sky' }],
    main: {
      temp: 22,
      feels_like: 21,
      humidity: 60,
      pressure: 1015
    },
    wind: { speed: 3.1 }
  },
  'new york': {
    name: 'New York',
    sys: { country: 'US' },
    weather: [{ icon: '02d', description: 'partly cloudy' }],
    main: {
      temp: 25,
      feels_like: 26,
      humidity: 65,
      pressure: 1008
    },
    wind: { speed: 5.2 }
  },
  'tokyo': {
    name: 'Tokyo',
    sys: { country: 'JP' },
    weather: [{ icon: '10d', description: 'light rain' }],
    main: {
      temp: 28,
      feels_like: 30,
      humidity: 80,
      pressure: 1006
    },
    wind: { speed: 3.8 }
  },
  'sydney': {
    name: 'Sydney',
    sys: { country: 'AU' },
    weather: [{ icon: '01d', description: 'sunny' }],
    main: {
      temp: 24,
      feels_like: 25,
      humidity: 55,
      pressure: 1020
    },
    wind: { speed: 6.1 }
  },
  'yangon': {
    name: 'Yangon',
    sys: { country: 'MM' },
    weather: [{ icon: '11d', description: 'thunderstorm' }],
    main: {
      temp: 32,
      feels_like: 36,
      humidity: 85,
      pressure: 1008
    },
    wind: { speed: 3.2 }
  }
};

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const suggestions = useMemo(() => {
    const searchTerm = city.toLowerCase().trim();
    if (!searchTerm) return [];
    
    return Object.keys(mockWeatherData)
      .filter(cityName => cityName.toLowerCase().includes(searchTerm))
      .map(cityName => ({
        name: mockWeatherData[cityName].name,
        country: mockWeatherData[cityName].sys.country
      }));
  }, [city]);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : prev
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedSuggestionIndex].name);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchCity = city.trim().toLowerCase();
    setShowSuggestions(false);
    
    setLoading(true);
    setTimeout(() => {
      if (mockWeatherData[searchCity]) {
        setWeather(mockWeatherData[searchCity]);
        setError(null);
      } else {
        setError('City not found. Available cities: London, Paris, New York, Tokyo, Sydney, Yangon');
        setWeather(null);
      }
      setLoading(false);
    }, 500);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    setShowSuggestions(value.trim().length > 0);
    setSelectedSuggestionIndex(-1);
    setError(null);
  };

  const handleSuggestionClick = (cityName) => {
    setCity(cityName);
    setShowSuggestions(false);
    
    setLoading(true);
    setTimeout(() => {
      const searchCity = cityName.toLowerCase();
      if (mockWeatherData[searchCity]) {
        setWeather(mockWeatherData[searchCity]);
        setError(null);
      }
      setLoading(false);
    }, 500);
  };

  const handleInputFocus = () => {
    if (city.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>
      
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            placeholder="Search city (e.g., London, Paris, Tokyo)"
            className="city-input"
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.name}-${suggestion.country}`}
                onClick={() => handleSuggestionClick(suggestion.name)}
                className={index === selectedSuggestionIndex ? 'selected' : ''}
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <div className="loading">Loading...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className="weather-main">
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p className="temperature">{Math.round(weather.main.temp)}°C</p>
          </div>
          <p className="description">{weather.weather[0].description}</p>
          <div className="weather-details">
            <div>
              <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
            <div>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p>Pressure: {weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather; 