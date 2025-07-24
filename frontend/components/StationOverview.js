'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  WiHumidity,
  WiBarometer,
  WiDaySunny,
  WiStrongWind,
  WiSnow,
  WiRaindrop,
  WiDirectionUp
} from 'react-icons/wi';
import { MapPin } from 'lucide-react';
import { FaSun } from 'react-icons/fa';

const stationStates = {
  'vishnu-prayag': 'Uttarakhand',
  'mana': 'Uttarakhand',
  'binakuli': 'Uttarakhand',
  'vasudhara': 'Uttarakhand'
};

const stationCoordinates = {
  'vishnu-prayag': { lat: 30.0767, long: 79.6133 },
  'mana': { lat: 30.7188, long: 79.6674 },
  'binakuli': { lat: 30.2711, long: 79.7436 },
  'vasudhara': { lat: 30.0794, long: 79.8292 }
};

export default function WeatherOverview() {
  const params = useParams();
  const station = params?.station;

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUnit, setTempUnit] = useState('C');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
  if (!station) return;

  try {
    const response = await fetch(`/api/station-data?station_name=${station.replace(/-/g, '_')}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();

    if (data && data.length > 0) {
      const latestData = data.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
      );
      setWeather(latestData);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  } finally {
    setLoading(false);
  }
};


    const fetchSunriseSunset = async () => {
      if (!station) return;

      try {
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${stationCoordinates[station].lat}&lng=${stationCoordinates[station].long}&formatted=0`);
        const data = await response.json();
        if (data && data.results) {
          setSunrise(new Date(data.results.sunrise).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
          setSunset(new Date(data.results.sunset).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (error) {
        console.error('Error fetching sunrise and sunset data:', error);
      }
    };

    fetchWeather();
    fetchSunriseSunset();
  }, [station]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-2xl">Loading...</div>;
  }

  if (!weather) {
    return <div className="flex justify-center items-center h-screen text-2xl text-red-500">Failed to load weather data</div>;
  }

  const stationDisplay = station.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateName = stationStates[station] || 'Uttarakhand';

  const temperature = tempUnit === 'C'
    ? Math.round(weather.temperature * 10) / 10
    : Math.round((weather.temperature * 9) / 5 + 32);

  const humidity = Math.round(weather.humidity);
  const pressure = Math.round(weather.pressure);
  const windSpeed = Math.round(weather.wind_speed);
  const windDirection = Math.round(weather.wind_direction);
  const rain = Math.round(weather.rain);
  const snow = Math.round(weather.snow);

  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  });
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const coordinates = stationCoordinates[station] || { lat: 'N/A', long: 'N/A' };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 ml-[200px]">
      <div className="flex flex-col lg:flex-row justify-start items-start gap-10 mt-[50px] px-6">

        {/* Main Weather Card */}
        <div className="bg-[#f0f5ff] rounded-3xl shadow-xl px-10 py-8 w-[320px] md:w-[500px] h-[560px] flex flex-col text-black">
          <div className="flex items-center gap-2 text-3xl md:text-4xl font-semibold text-[#409ac7] mb-1">
            <MapPin className="text-[#409ac7]" />
            {stationDisplay}
          </div>
          <div className="text-xl md:text-2xl font-semibold">{stateName}</div>
          <div className="text-lg md:text-xl font-medium mt-1">{formattedDate}, {formattedTime}</div>

          <div className="flex items-center justify-between mt-6 mb-4">
            <div className="text-[80px] md:text-[110px] font-extrabold leading-none">{temperature}°</div>
            <WiDaySunny className="text-yellow-400 text-[120px] md:text-[150px]" />
          </div>

          <div className="flex items-center gap-2 mb-4 text-xl font-bold justify-center">
            <span
              onClick={() => setTempUnit('C')}
              className={`cursor-pointer ${tempUnit === 'C' ? 'text-black' : 'text-gray-400'}`}
            >
              °C
            </span>
            <span className="text-gray-400">|</span>
            <span
              onClick={() => setTempUnit('F')}
              className={`cursor-pointer ${tempUnit === 'F' ? 'text-black' : 'text-gray-400'}`}
            >
              °F
            </span>
          </div>

          <div className="text-center text-2xl font-semibold mb-6">{weather.condition || 'Sunny'}</div>

          <div className="flex items-center gap-4 mb-3 text-lg md:text-xl">
            <WiHumidity className="text-[40px] md:text-[50px] text-[#409ac7]" />
            <span><span className="text-[#409ac7] font-bold">Humidity:</span> {humidity}%</span>
          </div>

          <div className="flex items-center gap-4 text-lg md:text-xl">
            <WiBarometer className="text-[40px] md:text-[50px] text-[#409ac7]" />
            <span><span className="text-[#409ac7] font-bold">Pressure:</span> {pressure} hPa</span>
          </div>
        </div>

        {/* Right Section (Cards) */}
        <div className="flex flex-col gap-6">
          {/* First Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Wind Direction */}
            <WeatherSmallCard icon={<WiDirectionUp />} label="Wind Dir" value={windDirection || 'N/A'} />
            {/* Wind Speed */}
            <WeatherSmallCard icon={<WiStrongWind />} label="Wind Speed" value={`${windSpeed} km/h`} />
            {/* Latitude & Longitude */}
            <div className="bg-[#f0f5ff] w-full h-[270px] rounded-3xl shadow-md flex flex-col justify-center items-center p-6 text-black">
              <div className="text-xl md:text-2xl font-semibold text-[#409ac7]">Latitude & Longitude</div>
              <div className="mt-4 text-center">
                <div className="text-lg md:text-xl font-semibold text-[#409ac7]">Latitude</div>
                <div className="text-2xl md:text-3xl font-bold">{coordinates.lat}</div>
                <div className="text-lg md:text-xl font-semibold text-[#409ac7] mt-2">Longitude</div>
                <div className="text-2xl md:text-3xl font-bold">{coordinates.long}</div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Rain */}
            <WeatherSmallCard icon={<WiRaindrop />} label="Rain" value={`${rain} mm`} />
            {/* Snow */}
            <WeatherSmallCard icon={<WiSnow />} label="Snow" value={`${snow} cm`} />
            {/* Sunrise/Sunset */}
            <div className="bg-[#f1f6ff] p-4 rounded-2xl shadow-sm flex flex-col justify-between min-w-[240px]">
          <div className="flex justify-end mb-2">
            <FaSun className="text-orange-500 text-4xl" />
          </div>
          <div className="w-full h-24 bg-gradient-to-t from-orange-300 to-orange-100 rounded-full"></div>
          <div className="flex justify-between mt-4 text-md font-medium text-black">
            <div>
              <div>Sunrise</div>
              <div className="text-lg font-bold">{sunrise}</div>
            </div>
            <div>
              <div>Sunset</div>
              <div className="text-lg font-bold">{sunset}</div>
            </div>
          </div>
        </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Small Card Component
function WeatherSmallCard({ icon, label, value }) {
  return (
    <div className="bg-[#f0f5ff] w-full h-[270px] rounded-3xl shadow-md flex flex-col justify-center items-center text-black hover:scale-105 transition-transform duration-300">
      <div className="text-[90px] text-[#409ac7]">{icon}</div>
      <div className="text-lg md:text-xl font-semibold mt-2">{label}</div>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
    </div>
  );
}
