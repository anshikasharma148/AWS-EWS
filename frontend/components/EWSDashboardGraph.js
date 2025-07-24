'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Brush
} from 'recharts';

const WaterTrends = () => {
  const [graphData, setGraphData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Today');

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await fetch(`/api/ews-graph-data?period=${encodeURIComponent(selectedPeriod)}`);
        const json = await res.json();
        if (json.success) {
          const merged = mergeStationData(json.data);
          setGraphData(merged);
        }
      } catch (err) {
        console.error("Error fetching graph data:", err);
      }
    };

    fetchGraphData();
  }, [selectedPeriod]);

  const mergeStationData = (data) => {
    const merged = {};

    ['ghastoli', 'vasudhara', 'lambagad'].forEach((station) => {
      data[station]?.forEach(({ timestamp, water_discharge, water_level, water_velocity }) => {
        const dateObj = new Date(timestamp);
        const date = dateObj.toLocaleDateString('en-GB');
        const time = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const dateTime = `${date} ${time}`;

        if (!merged[dateTime]) merged[dateTime] = { time: dateTime };
        merged[dateTime][`${station}_discharge`] = water_discharge;
        merged[dateTime][`${station}_level`] = water_level;
        merged[dateTime][`${station}_velocity`] = water_velocity;
      });
    });

    return Object.values(merged).sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  const renderLineChart = (dataKeySuffix, title, colors, unit) => (
    <div className="mb-12">
      <h2 className="text-4xl font-bold text-yellow-400 text-center mb-2 uppercase drop-shadow-lg">{title.split(' (')[0]}</h2>
      <h3 className="text-xl font-medium text-white mb-6 text-center">{title}</h3>

      <div className="bg-gradient-to-br from-white to-slate-100 rounded-xl p-5 shadow-2xl transition-all duration-500 hover:shadow-yellow-400/40">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={graphData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 14, fill: '#0f172a', fontWeight: 500 }}
              interval="preserveStartEnd"
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 16, fill: '#0f172a', fontWeight: 500 }}
              tickFormatter={(value) => `${value} ${unit}`}
            />
<Tooltip
  contentStyle={{
    backgroundColor: "#f0f9ff",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    fontSize: "14px",
  }}
  formatter={(value, name) => [`${parseFloat(value).toFixed(2)} ${unit}`, name]}
  labelFormatter={(label) => (
    <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#0f172a' }}>
      {label}
    </span>
  )}
/>
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#1e293b',
                paddingTop: '10px',
                paddingBottom: '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
              }}
            />
            {['ghastoli', 'vasudhara', 'lambagad'].map((station, i) => (
              <Line
                key={station}
                type="monotone"
                dataKey={`${station}_${dataKeySuffix}`}
                stroke={colors[i]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1000}
              />
            ))}
            <Brush
              dataKey="time"
              height={30}
              stroke="#2563eb"
              tick={{ fontSize: 12, fill: '#0f172a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  if (!graphData) return <p className="text-white text-center text-xl animate-pulse">Loading graphs...</p>;

  return (
    <div className="relative z-20 mt-10 w-full px-4 md:px-10">
      <div className="flex flex-col items-center text-center mt-20 relative z-20">
        <h1 className="text-5xl font-extrabold tracking-wide text-white drop-shadow-md animate-fade-slide mb-16">
          <span className="inline-block text-7xl text-yellow-400">W</span>ater
          <span className="ml-4 text-7xl text-yellow-400">T</span>rends
          <span className="ml-4 text-7xl text-yellow-400">A</span>nalysis
        </h1>
      </div>

      <div className="bg-slate-800/30 rounded-3xl shadow-2xl backdrop-blur-lg p-6 md:p-10 space-y-16">
        <div className="flex justify-center flex-wrap gap-4 text-white font-semibold text-lg mb-4">
          {["Today", "Yesterday", "3 days", "7 days", "30 days"].map(label => (
            <button
              key={label}
              onClick={() => setSelectedPeriod(label)}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedPeriod === label
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {renderLineChart('discharge', 'Water Discharge (m³/s)', ['#ef4444', '#f97316', '#dc2626'], 'm³/s')}
        {renderLineChart('level', 'Water Level (m)', ['#2563eb', '#3b82f6', '#1e40af'], 'm')}
        {renderLineChart('velocity', 'Water Velocity (m/s)', ['#22c55e', '#16a34a', '#15803d'], 'm/s')}
      </div>
    </div>
  );
};

export default WaterTrends;
