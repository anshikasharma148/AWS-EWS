"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const colorMap = {
    level: "hotpink",
    velocity: "skyblue",
    discharge: "darkblue",
  };

  const unitMap = {
    level: "m",
    velocity: "m/s",
    discharge: "cumec",
  };

  return (
    <div
      style={{
        backgroundColor: "#e0f2fe",
        border: "1px solid #bae6fd",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        fontSize: "13px",
        color: "#1e3a8a",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: colorMap[entry.dataKey] }}>
          {`${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: ${Number(
            entry.value
          ).toFixed(2)} ${unitMap[entry.dataKey]}`}
        </div>
      ))}
    </div>
  );
};

export default function StationGraph({ station }) {
  const [graphData, setGraphData] = useState([]);
  const [visiblePoints, setVisiblePoints] = useState(50);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`/api/ews-graph-data?station=${station}&period=Today`);
      const text = await response.text();
      const data = JSON.parse(text);
      if (data.success && data.data[station]) {
        const formatted = data.data[station].map((entry) => ({
          rawTime: entry.timestamp,
          time: new Date(entry.timestamp).toLocaleTimeString(),
          level: entry.water_level,
          velocity: entry.water_velocity,
          discharge: entry.water_discharge,
        }));
        setGraphData(formatted);
      } else {
        console.error("Invalid historical data format:", data);
      }
    } catch (err) {
      console.error("Error fetching historical data:", err);
    }
  };

  const fetchLatestData = async () => {
    try {
      const response = await fetch(`/api/ews-stations?station=${station}`);
      const data = await response.json();

      if (data.success && data.data[station]) {
        const latest = {
          rawTime: data.data[station].timestamp,
          time: new Date(data.data[station].timestamp).toLocaleTimeString(),
          level: data.data[station].water_level,
          velocity: data.data[station].water_velocity,
          discharge: data.data[station].water_discharge,
        };

        setGraphData((prev) => {
          const last = prev.length ? prev[prev.length - 1] : null;
          if (!last || new Date(latest.rawTime) > new Date(last.rawTime)) {
            const updated = [...prev, latest];
            return updated.length > 100 ? updated.slice(updated.length - 100) : updated;
          }
          return prev;
        });
      } else {
        console.error("Invalid latest data format:", data);
      }
    } catch (err) {
      console.error("Error fetching latest data:", err);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
    const intervalId = setInterval(fetchLatestData, 30000);
    return () => clearInterval(intervalId);
  }, [station]);

  const slicedData = graphData.slice(-visiblePoints);

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto">
        <div style={{ width: `${Math.max(slicedData.length * 50, 700)}px`, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slicedData} margin={{ top: 40, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
                tick={{ fill: "#1f2937", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#1f2937", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="center"
                iconType="circle"
                wrapperStyle={{ color: "#1f2937", fontSize: 14 }}
                formatter={(value) => {
                  const labelMap = {
                    level: "Level (m)",
                    velocity: "Velocity (m/s)",
                    discharge: "Discharge (cumec)",
                  };
                  return labelMap[value] || value;
                }}
              />
              <Line type="monotone" dataKey="level" stroke="hotpink" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="velocity" stroke="skyblue" strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="discharge" stroke="darkblue" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      

    </div>
  );
}
