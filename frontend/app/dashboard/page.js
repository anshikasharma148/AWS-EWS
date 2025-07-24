"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import AddStationForm from "../../components/AddStationForm";
import {
  FaTemperatureHigh,
  FaWind,
  FaCloudSun,
  FaTachometerAlt,
  FaTint,
  FaCloudRain,
  FaSnowflake,
} from "react-icons/fa";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const stationLabels = [
    { code: "G-1", name: "Ghastoli" },
    { code: "V-1", name: "Vasudhara" },
    { code: "L-1", name: "Lambagad" },
  ];

  const [waterLevels, setWaterLevels] = useState([0, 0, 0]);
  const [waterVelocities, setWaterVelocities] = useState([0, 0, 0]);
  const [weatherData, setWeatherData] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();

        if (json.success) {
          setWaterLevels(json.data.waterLevels.map((v) => Math.round(v)));
          setWaterVelocities(json.data.waterVelocities.map((v) => Math.round(v)));

          const roundedWeatherData = json.data.weatherData.map((w) => ({
            ...w,
            temperature: Math.round(w.temperature),
            windSpeed: Math.round(w.windSpeed),
            windDirection: Math.round(w.windDirection),
            pressure: Math.round(w.pressure),
            humidity: Math.round(w.humidity),
            rain: Math.round(w.rain),
            snow: Math.round(w.snow),
          }));

          setWeatherData(roundedWeatherData);

          // Only set selected station initially
          setSelectedStation((prev) => prev || roundedWeatherData[0]?.station || "");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const predictiveWaterLevel = Math.round(
    waterLevels.reduce((a, b) => a + parseFloat(b), 0) / waterLevels.length || 0
  );

  const predictiveVelocity = Math.round(
    waterVelocities.reduce((a, b) => a + parseFloat(b), 0) / waterVelocities.length || 0
  );

  const predictiveDischarge = Math.round(
    0.8 * predictiveWaterLevel * predictiveVelocity
  );

  // Find the weather data to display: if no station selected, show Vishnu Prayag or first station
  const defaultStation = weatherData.find((w) => w.station.toLowerCase().includes("vishnu")) || weatherData[0];
  const selectedWeather = weatherData.find((w) => w.station === selectedStation) || defaultStation;

  return (
    <div
      className="min-h-screen flex flex-col text-[var(--foreground)] bg-cover bg-center"
      style={{ backgroundImage: "url('/images/dashimage.png')" }}
    >
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        openForm={() => setFormOpen(true)}
      />
      <AddStationForm isOpen={formOpen} closeForm={() => setFormOpen(false)} />

      <div className="flex flex-1 p-8 mt-[64px]">
        <div className="w-[350px] bg-[#409ac7] shadow-lg p-6 rounded-lg border border-gray-700 bg-opacity-90">
          <h2 className="text-black text-3xl font-extrabold underline mb-4 text-center">
            BARRAGE
          </h2>

          {/* Water Level */}
          <h3 className="text-white text-xl font-semibold mb-2 border-b border-gray-600 pb-1 text-center">
            WATER LEVEL
          </h3>
          <ul className="text-black mb-4 space-y-2 text-sm font-medium">
            {stationLabels.map((station, idx) => (
              <li key={station.code} className="flex items-center gap-2">
                <span className="font-bold">{station.code} ({station.name}):</span>
                <input
                  type="number"
                  value={waterLevels[idx]}
                  readOnly
                  className="w-20 px-2 py-1 rounded border border-gray-300 bg-gray-100"
                />
                <span>m</span>
              </li>
            ))}
          </ul>
          <p className="text-black font-semibold text-sm italic">
            <span className="font-bold">Predictive Water Level:</span> {predictiveWaterLevel} m
          </p>

          {/* Water Velocity */}
          <h3 className="text-white text-xl font-semibold mt-6 mb-2 border-b border-gray-600 pb-1 text-center">
            WATER VELOCITY
          </h3>
          <ul className="text-black mb-4 space-y-2 text-sm font-medium">
            {stationLabels.map((station, idx) => (
              <li key={station.code} className="flex items-center gap-2">
                <span className="font-bold">{station.code} ({station.name}):</span>
                <input
                  type="number"
                  value={waterVelocities[idx]}
                  readOnly
                  className="w-20 px-2 py-1 rounded border border-gray-300 bg-gray-100"
                />
                <span>m/s</span>
              </li>
            ))}
          </ul>
          <p className="text-black font-semibold text-sm italic">
            <span className="font-bold">Predictive Water Velocity:</span> {predictiveVelocity} m/s
          </p>

          {/* Discharge */}
          <h3 className="text-white text-xl font-semibold mt-6 mb-2 border-b border-gray-600 pb-1 text-center">
            WATER DISCHARGE
          </h3>
          <p className="text-black font-semibold text-sm italic">
            <span className="font-bold">Predictive Water Discharge:</span> {predictiveDischarge} m³/s
          </p>

          {/* Weather Measurements with Dropdown */}
          <div className="mt-6 mb-2 border-b border-gray-600 pb-1">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-xl font-semibold">MEASUREMENTS</h3>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="px-2 py-1 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black font-semibold shadow-sm transition duration-150 ease-in-out min-w-[110px] max-w-[130px]"
              >
                <option value="" disabled>
                  Select Station
                </option>
                {weatherData.map((w) => (
                  <option key={w.station} value={w.station}>
                    {w.station.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul className="text-black space-y-2 text-sm font-medium">
            {selectedWeather ? (
              <>
                <li className="flex items-center gap-2">
                  <FaTemperatureHigh className="text-white" />
                  <span><strong>Temperature:</strong> {selectedWeather.temperature} °C</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaWind className="text-white" />
                  <span><strong>Wind Speed:</strong> {selectedWeather.windSpeed} km/h</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCloudSun className="text-white" />
                  <span><strong>Wind Direction:</strong> {selectedWeather.windDirection}°</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaTachometerAlt className="text-white" />
                  <span><strong>Pressure:</strong> {selectedWeather.pressure} hPa</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaTint className="text-white" />
                  <span><strong>Humidity:</strong> {selectedWeather.humidity}%</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCloudRain className="text-white" />
                  <span><strong>Rain:</strong> {selectedWeather.rain} mm</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaSnowflake className="text-white" />
                  <span><strong>Snow:</strong> {selectedWeather.snow} cm</span>
                </li>
              </>
            ) : (
              <li>No weather data available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
