'use client';
import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer, Legend, Brush
} from 'recharts';
import Navbar from '../../../components/Navbar';
import StationOverview from '../../../components/StationOverview'
import { useParams } from 'next/navigation';
import {
  WiHumidity, WiBarometer, WiDaySunny, WiStrongWind, WiSnow, WiRaindrop, WiDirectionUp
} from 'react-icons/wi';

const stationStates = {
  'vishnu-prayag': 'Uttarakhand',
  'mana': 'Uttarakhand',
  'binakuli': 'Uttarakhand',
  'vasudhara': 'Uttarakhand'
};

const parameters = ["Temperature", "Pressure", "Humidity", "Wind", "Rain", "Snow"];
const units = {
  Temperature: "°C",
  Pressure: "hPa",
  Humidity: "%",
  Rain: "mm",
  Snow: "cm",
  Wind: "km/h"
};

const colors = {
  Temperature: "#ff4c4c",
  Pressure: "#0099cc",
  Humidity: "#4caf50",
  Wind: "#6a1b9a",
  Rain: "#1e88e5",
  Snow: "#fbc02d"
};

// New function to calculate background gradient based on temperature
const getBackgroundGradient = (temperature) => {
  if (temperature === null || temperature === undefined) return 'from-[#1d3557] to-[#457b9d]';
  if (temperature < 0) return 'from-[#1e3c72] to-[#2a5298]'; // Cold
  if (temperature < 15) return 'from-[#457b9d] to-[#a8dadc]'; // Cool
  if (temperature < 30) return 'from-[#f9c74f] to-[#f9844a]'; // Warm
  return 'from-[#f94144] to-[#f3722c]'; // Hot
};

export default function StationPage() {
  const { station } = useParams();
  const stationDisplay = station.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const stateName = stationStates[station] || 'Uttarakhand';

  const [selectedParams, setSelectedParams] = useState(["Temperature"]);
  const [days, setDays] = useState(1);
  const [data, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCelsius, setIsCelsius] = useState(true);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const apiStation = station.replace(/-/g, '_');
      const response = await fetch(`/api/station-data?station_name=${apiStation}`);

;
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();

      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);

      let end = new Date(now);
      if (days === 2) {
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
      } else if (days > 2) {
        start.setDate(start.getDate() - days + 1);
      }

      const filtered = result.filter(item => {
        const date = new Date(item.timestamp);
        return date >= start && date <= end;
      });

      const formatted = filtered.map(item => {
        const date = new Date(item.timestamp);
        return {
          time: days === 1 || days === 2
            ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
            : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          Temperature: Math.round(item.temperature),
          Pressure: Math.round(item.pressure),
          Humidity: Math.round(item.humidity),
          Wind: Math.round(item.wind_speed),
          Rain: Math.round(item.rain),
          Snow: Math.round(item.snow),
          WindDirection: item.wind_direction
        };
      });

      setData(formatted);

      const latest = result[result.length - 1];
      setLiveData({
        Temperature: Math.round(latest.temperature),
        Humidity: Math.round(latest.humidity),
        Pressure: Math.round(latest.pressure),
        Wind: Math.round(latest.wind_speed),
        Rain: Math.round(latest.rain),
        Snow: Math.round(latest.snow),
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, [station, days]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleParam = (param) => {
    setSelectedParams(prev =>
      prev.includes(param)
        ? prev.filter(p => p !== param)
        : [...prev, param]
    );
  };

  const toggleUnit = () => setIsCelsius(prev => !prev);

  const formattedDate = currentTime.toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long'
  });
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const temperatureValue = isCelsius && liveData ? liveData.Temperature : liveData ? Math.round((liveData.Temperature * 9) / 5 + 32) : '--';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${getBackgroundGradient(liveData?.Temperature)} pb-20 text-white transition-all duration-700`}>
      <Navbar />

      <div className="pt-28 px-12">
        <div className="w-full bg-[#f0f5ff] text-black rounded-3xl shadow-md p-8 flex justify-between items-center h-[260px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-extrabold tracking-wide flex gap-2">
              {stationDisplay.split(' ').map((word, i) => (
                <span key={i}>
                  <span className="text-yellow-500 text-6xl font-bold">{word[0]}</span>
                  {word.slice(1)}
                </span>
              ))}
            </h1>
            <div className="text-xl text-gray-700 font-semibold">{stateName}</div>
            <div className="text-md text-gray-600 font-medium">{formattedDate}, {formattedTime}</div>
          </div>

          <div className="w-[65%] flex flex-wrap justify-center gap-3">
            {liveData && [
              { icon: <WiHumidity />, label: 'Humidity', value: `${liveData.Humidity}%`, color: colors.Humidity },
              { icon: <WiBarometer />, label: 'Pressure', value: `${liveData.Pressure} hPa`, color: colors.Pressure },
              { icon: <WiDirectionUp />, label: 'Wind Dir', value: 'NNE', color: '#a855f7' },
              { icon: <WiStrongWind />, label: 'Speed', value: `${liveData.Wind} km/h`, color: colors.Wind },
              { icon: <WiRaindrop />, label: 'Rain', value: `${liveData.Rain} mm`, color: colors.Rain },
              { icon: <WiSnow />, label: 'Snow', value: `${liveData.Snow} cm`, color: colors.Snow }
            ].map(({ icon, label, value, color }, index) => (
              <div key={index} className="w-[140px] h-[140px] rounded-2xl flex flex-col items-center justify-center text-white font-bold text-center transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-2xl" style={{
                backgroundColor: color,
                boxShadow: `0 6px 15px -3px ${color}90`
              }}>
                <div className="text-[38px] mb-1">{icon}</div>
                <div className="text-base leading-tight">
                  {label}<br />
                  <span className="text-lg font-semibold">{value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="text-[72px] leading-none font-extrabold flex items-start text-black">
              {temperatureValue}°
              <sup className="ml-1 text-base font-medium">
                <span className={`${isCelsius ? 'font-bold text-black' : 'text-gray-500'} cursor-pointer`} onClick={() => setIsCelsius(true)}>C</span>
                <span className="text-gray-500 mx-1">|</span>
                <span className={`${!isCelsius ? 'font-bold text-black' : 'text-gray-500'} cursor-pointer`} onClick={() => setIsCelsius(false)}>F</span>
              </sup>
            </div>
            <WiDaySunny className="text-yellow-400 text-[80px] font-extrabold drop-shadow-sm" />
          </div>
        </div>
      </div>

      <div className="text-center font-semibold text-md mt-6 mb-3 space-x-6">
        {["Today", "Yesterday", "3 days", "7 days", "30 days"].map((label) => {
          const value = label === "Today" ? 1 : label === "Yesterday" ? 2 : label === "3 days" ? 3 : label === "7 days" ? 7 : 30;
          return (
            <span key={label} onClick={() => setDays(value)} className={`cursor-pointer hover:underline ${days === value ? 'text-yellow-400' : 'text-white'}`}>
              {label}
            </span>
          );
        })}
      </div>

      <div className="bg-[#f0f5ff] rounded-3xl shadow-lg p-4 mx-12 text-black">
        <div className="flex flex-wrap gap-4 border-b border-gray-300 mb-4">
          {parameters.map(param => (
            <span
              key={param}
              onClick={() => toggleParam(param)}
              style={{
                borderBottom: selectedParams.includes(param) ? `4px solid ${colors[param]}` : '4px solid transparent',
                color: selectedParams.includes(param) ? colors[param] : '#6b7280',
              }}
              className="text-lg font-semibold cursor-pointer transition pb-1"
            >
              {param}
            </span>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={400} key={selectedParams.join(',')}>

          <AreaChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-blue-100 border border-blue-300 rounded-xl p-4 shadow-lg text-sm">
                    <p className="font-bold text-blue-900 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="mb-1">
                        <span style={{ color: colors[entry.name], fontWeight: 600 }}>
                          {entry.name}:
                        </span>{" "}
                        <span className="text-gray-700">{entry.value} {units[entry.name] || ''}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Legend />
            <Brush dataKey="time" height={30} stroke="#409ac7" />
            {selectedParams.map(param => (
              <Area
              key={param}
              type="monotone"
              dataKey={param}
              stroke={colors[param]}
              fill={colors[param]}
              fillOpacity={0.15}
              strokeWidth={2}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
              activeDot={{
                r: 8,
                stroke: '#fff',
                strokeWidth: 2,
                fill: colors[param],
                style: { filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.5))' }
              }}
            />
            
            ))}
          </AreaChart>
        </ResponsiveContainer>
        

      </div>
      <StationOverview station={station} liveData={liveData} />
    </div>
  );
}
