'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPin, Waves, Gauge, Droplets,
  BatteryCharging, Zap, Plug
} from "lucide-react";
import Navbar from "../../components/Navbar";
import BatteryIndicator from "../../components/BatteryIndicator";
import EWSDashboardGraph from "../../components/EWSDashboardGraph";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const SplashScreen = dynamic(() => import("../../components/SplashScreen"), { ssr: false });

const stations = [
  { name: "Ghastoli", slug: "ghastoli" },
  { name: "Vasudhara", slug: "vasudhara" },
  { name: "Lambagad", slug: "lambagad" },
];

export default function EWSPage() {
  const router = useRouter();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [splashVideo, setSplashVideo] = useState(null);
  const [redirectSlug, setRedirectSlug] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [miniGraphData, setMiniGraphData] = useState({});

  // Fetch live station summary data
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("/api/ews-stations");
        const json = await res.json();
        if (json.success) {
          setLiveData(json.data);
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch mini graph data
  useEffect(() => {
    const fetchMiniGraphData = async () => {
      try {
        const res = await fetch("/api/ews-mini-graph");
        const json = await res.json();
        if (json.success) {
          setMiniGraphData(json.data);
        }
      } catch (err) {
        console.error("Error fetching mini graph data:", err);
      }
    };

    fetchMiniGraphData();
    const interval = setInterval(fetchMiniGraphData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleStationClick = (slug) => {
    setSplashVideo(`/globe/${slug}globe.mp4`);
    setRedirectSlug(slug);
  };

  const handleSplashEnd = () => {
    if (redirectSlug) {
      router.push(`/ews/${redirectSlug}`);
    }
  };
  const renderStationMiniGraph = (stationSlug) => {
    const miniData = miniGraphData?.[stationSlug] || [];
  
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const date = new Date(label);
        const formattedDate = date.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        const formattedTime = date.toLocaleTimeString('en-IN', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
  
        return (
          <div className="bg-blue-100 p-3 rounded-lg shadow-lg text-sm text-gray-800 border border-blue-300">
            <p className="font-semibold mb-1">{formattedDate}, {formattedTime}</p>
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {parseFloat(entry.value).toFixed(2)}
              </p>
            ))}
          </div>
        );
      }
  
      return null;
    };
  
    const formatXAxisTime = (time) => {
      const date = new Date(time);
      return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    };
  
    const renderCustomLegend = () => (
      <div className="flex justify-center space-x-4 mb-2">
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
          <span>Level (m)</span>
        </div>
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" />
          <span>Velocity (m/s)</span>
        </div>
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span className="w-3 h-3 rounded-full bg-blue-900 inline-block" />
          <span>Discharge (cumec)</span>
        </div>
      </div>
    );
  
    return (
      <div className="w-full h-[180px] flex flex-col items-center justify-center">
  {renderCustomLegend()}
  <ResponsiveContainer width="100%" height="130%">
    <LineChart data={miniData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="time"
        tickFormatter={formatXAxisTime}
        interval={0}
        tick={{
          fontSize: 10,
          fill: '#000',
          angle: -45,
          dy: 10,
          textAnchor: 'end',
        }}
      />
      <YAxis tick={{ fontSize: 14, fill: '#000', fontWeight: 500 }} />
      <Tooltip content={<CustomTooltip />} />
      <Line type="monotone" dataKey="level" stroke="hotpink" dot={false} strokeWidth={1} name="Level (m)" />
      <Line type="monotone" dataKey="velocity" stroke="skyblue" dot={false} strokeWidth={1} name="Velocity (m/s)" />
      <Line type="monotone" dataKey="discharge" stroke="darkblue" dot={false} strokeWidth={1} name="Discharge (cumec)" />
    </LineChart>
  </ResponsiveContainer>
  <p className="text-xs mt-2 text-gray-600 font-medium">Last 1 hour data</p>
</div>

    );
  };
  
  

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Navbar />
      {splashVideo && <SplashScreen videoPath={splashVideo} onEnd={handleSplashEnd} />}

      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        onCanPlayThrough={() => setVideoLoaded(true)}
      >
        <source src="/videos/alaknanda.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      <div className="flex flex-col items-center text-center pt-[96px] relative z-20">
        <h1 className="text-5xl font-bold tracking-wide text-white drop-shadow-md animate-fade-slide">
          <span className="inline-block text-7xl font-extrabold text-yellow-400">E</span>arly
          <span className="ml-4 text-7xl font-extrabold text-yellow-400">W</span>arning
          <span className="ml-4 text-7xl font-extrabold text-yellow-400">S</span>ystem
        </h1>
      </div>

      <div className="relative z-20 mt-8 mb-[230px] px-6 flex flex-wrap justify-center gap-6">
        {stations.map((station) => {
          const data = liveData?.[station.slug];

          return (
            <div
              key={station.slug}
              className="w-[450px] h-[720px] bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 text-gray-700 rounded-2xl shadow-xl backdrop-blur-sm py-8 px-6 flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-blue-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-[#409ac7]" size={26} />
                <h2
                  className="text-3xl font-bold text-[#409ac7] hover:underline cursor-pointer"
                  onClick={() => handleStationClick(station.slug)}
                >
                  {station.name}
                </h2>
              </div>

              <div className="flex-grow flex flex-col justify-start text-xl font-semibold text-gray-700 space-y-5 mt-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Droplets size={22} className="text-red-500" />
                    <span className="text-red-500">Water Discharge:</span>
                  </div>
                  <p className="text-red-500">{data?.water_discharge?.toFixed(2)} m³/s</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Waves size={22} className="text-[#2563eb]" />
                    <span>Water Level:</span>
                  </div>
                  <p className="text-[#2563eb]">{data?.water_level?.toFixed(2)} m</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Gauge size={22} className="text-[#2563eb]" />
                    <span>Water Velocity:</span>
                  </div>
                  <p className="text-[#2563eb]">{data?.water_velocity?.toFixed(2)} m/s</p>
                </div>

                <div className="border-t pt-3 space-y-2 mt-3">
                  <p className="text-lg font-bold text-[#2563eb] mb-1">Inverter and (%)</p>
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-2">
                      <BatteryCharging size={18} />
                      <span>PV Voltage</span>
                    </span>
                    <span>{data?.PV_voltage?.toFixed(2)} V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-2">
                      <Zap size={18} />
                      <span>Batt. Charge Curr.</span>
                    </span>
                    <span>{data?.battery_charge_curr?.toFixed(2)} A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-2">
                      <Plug size={18} />
                      <span>Inv AC Load</span>
                    </span>
                    <span>{data?.Inv_AC_load?.toFixed(2)} A</span>
                  </div>
                </div>
                <BatteryIndicator level={90} />
              </div>

              <div className="border-t mt-3 pt-3 h-[35%] flex items-center justify-center">
                {renderStationMiniGraph(station.slug)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Water Trends Section */}
      <div className="relative z-20 mb-20 px-6 w-full">
        <EWSDashboardGraph />
      </div>
    </div>
  );
}
