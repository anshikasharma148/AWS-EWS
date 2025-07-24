'use client';
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Brush
} from "recharts";

const parameters = ["Temperature", "Pressure", "Humidity", "Wind Speed", "Rain", "Snow"];
const units = {
  "Temperature": "°C", "Pressure": "hPa", "Humidity": "%",
  "Wind Speed": "km/h", "Rain": "mm", "Snow": "cm"
};
const colors = {
  "Vishnu Prayag": "#e74c3c",
  "Mana": "#2980b9",
  "Binakuli": "#27ae60",
  "Vasudhara": "#8e44ad"
};

const CustomTooltip = ({ active, payload, label, param }) => {
  if (active && payload && payload.length) {
    // Function to format date and time in 12-hour format
    const getFormattedDateTime = (timestamp) => {
      const date = new Date(timestamp);
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const dateStr = date.toLocaleDateString('en-US', options); // Full date
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }); // 12-hour time format
      return `${dateStr}, ${timeStr}`; // Combine date and time
    };

    return (
      <div className="p-3 rounded-lg bg-blue-100 border border-blue-300 text-black shadow-lg">
        {/* Format the date and time */}
        <p className="text-sm font-semibold mb-1">{getFormattedDateTime(label)}</p>
        {payload.map((entry, index) => {
          const stationName = entry.name.split('-')[0];
          const roundedValue = typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value;
          return (
            <p key={index} className="text-sm">
              <span className="font-bold" style={{ color: entry.color }}>
                {stationName}:
              </span> {roundedValue} {units[param]}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function ParameterGraphs() {
  const [days, setDays] = useState(1);
  const [data, setData] = useState([]);

  const getDayString = (date) => new Date(date).toDateString();

  const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await fetch(`/api/graph-data?days=${days}`);
        const raw = await res.json();
  
        const mergedData = {};
        for (const tableName in raw) {
          const stationName = tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
          raw[tableName].forEach(row => {
            const time = row.time;
            if (!mergedData[time]) mergedData[time] = { time };
  
            parameters.forEach(param => {
              const dbKey = param.toLowerCase().replace(' ', '_');
              mergedData[time][`${stationName}-${param}`] = row[dbKey];
            });
          });
        }
  
        const sorted = Object.values(mergedData).sort((a, b) => new Date(a.time) - new Date(b.time));
  
        const today = new Date();
        const todayStr = getDayString(today);
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = getDayString(yesterday);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 2);
        const twoDaysAgoStr = getDayString(twoDaysAgo);
  
        const filtered = sorted.filter(d => {
          const dateStr = getDayString(d.time);
          if (days === 1) return dateStr === todayStr;
          if (days === 2) return dateStr === yesterdayStr;
          if (days === 3) return [todayStr, yesterdayStr, twoDaysAgoStr].includes(dateStr);
          return true; // For 7 or 30 days, no strict filter
        });
  
        setData(filtered);
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
      }
    };
  
    fetchGraphData();
  }, [days]);
  

  const stationNames = ["Vishnu Prayag", "Mana", "Binakuli", "Vasudhara"];

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg">
      {/* Date Filters */}
      <div className="flex justify-center mb-4 text-black font-semibold space-x-6">
        {["Today", "Yesterday", "3 days", "7 days", "30 days"].map(label => {
          const value = label === "Today" ? 1 : label === "Yesterday" ? 2 : label === "3 days" ? 3 : label === "7 days" ? 7 : 30;
          return (
            <span
              key={label}
              onClick={() => setDays(value)}
              className={`cursor-pointer ${days === value ? 'underline text-yellow-500' : 'hover:underline'}`}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Graphs */}
      {parameters.map(param => (
        <div key={param} className="mb-12 bg-blue-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold mb-4 text-black">{param}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="time"
                minTickGap={20}
                tickFormatter={getFormattedTime}
              />
              <YAxis unit={units[param]} />
              <Tooltip content={<CustomTooltip param={param} />} />
              <Legend />
              <Brush dataKey="time" height={30} stroke="#409ac7" />
              {stationNames.map(station => (
                <Line
                  key={`${station}-${param}`}
                  type="monotone"
                  dataKey={`${station}-${param}`}
                  stroke={colors[station]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                  name={`${station} - ${param}`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}
