"use client";

import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaWater, FaTachometerAlt } from "react-icons/fa";
import BatteryIndicator from "../../../components/BatteryIndicator";
import StationGraph from "../../../components/EWSStationGraph";
// ✅ Make sure this path is correct

const stationData = {
  lambagad: {
    name: "Lambagad",
    image: "/ews_images/lambagadimg.png",
  },
  vasudhara: {
    name: "Vasudhara",
    image: "/ews_images/vasudharaimg.png",
  },
  ghastoli: {
    name: "Ghastoli",
    image: "/ews_images/ghastoliimg.png",
  },
};

export default function StationPage() {
  const { station } = useParams();
  const currentStation = stationData[station];
  const [showHeading, setShowHeading] = useState(false);
  const [stationDataFromAPI, setStationDataFromAPI] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setShowHeading(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/ews-stations`);
        const data = await response.json();
        if (data.success) {
          setStationDataFromAPI(data.data);
        } else {
          console.error("Failed to fetch station data");
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };
    fetchData();
  }, []);

  if (!currentStation) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="text-center mt-20 text-red-600 font-semibold text-xl">
          Station not found
        </div>
      </div>
    );
  }

  const renderStyledName = (name) => {
    const firstLetter = name.charAt(0);
    const rest = name.slice(1);
    return (
      <div
        className={`px-6 py-3 rounded-lg border border-gray-300 bg-black transition-all duration-700 transform shadow-[0_0_12px_2px_rgba(192,192,192,0.5)] ${
          showHeading ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
          <span className="text-yellow-400 text-6xl md:text-7xl drop-shadow-lg">
            {firstLetter}
          </span>
          {rest}
        </h1>
      </div>
    );
  };

  if (!stationDataFromAPI) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="text-center mt-20 text-blue-600 font-semibold text-xl">
          Loading station data...
        </div>
      </div>
    );
  }

  const stationLiveData = stationDataFromAPI[station];

  return (
    <div className="bg-white min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px]">
        <Image
          src={currentStation.image}
          alt={`${currentStation.name} Image`}
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="absolute bottom-6 w-full flex justify-center items-center z-20">
          {renderStyledName(currentStation.name)}
        </div>
      </div>

      {/* Info Cards Section */}
      <div className="mt-5 ml-6 flex gap-6">
        {/* Water Discharge Card */}
        <div className="bg-[#eff6ff] text-black rounded-xl shadow-lg p-8 w-[300px] h-64 flex flex-col items-center justify-center">
          <p className="text-5xl font-extrabold text-center">
            {stationLiveData?.water_discharge?.toFixed(2)} m<sup className="text-3xl">3</sup>
          </p>
          <p className="text-xl md:text-2xl font-bold text-red-700 mt-2 text-center">
            WATER DISCHARGE
          </p>
          <div className="mt-4">
            <FaWater className="text-[#409ac7] text-4xl" />
          </div>
        </div>

        {/* Right-side Cards */}
        <div className="flex flex-col justify-between h-64">
          {/* Water Level Card */}
          <div className="bg-[#eff6ff] text-black rounded-xl shadow-lg p-4 w-[360px] h-[120px] flex flex-col items-center justify-center">
            <p className="text-4xl font-extrabold text-center">
              {stationLiveData?.water_level?.toFixed(2)} m
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#409ac7] font-bold text-lg">
              <span>WATER LEVEL</span>
              <FaWater className="text-[#409ac7] text-xl" />
            </div>
          </div>

          {/* Water Velocity Card */}
          <div className="bg-[#eff6ff] text-black rounded-xl shadow-lg p-4 w-[360px] h-[120px] flex flex-col items-center justify-center">
            <p className="text-4xl font-extrabold text-center">
              {stationLiveData?.water_velocity?.toFixed(2)} m/s
            </p>
            <div className="mt-2 flex items-center gap-2 text-[#409ac7] font-bold text-lg">
              <span>WATER VELOCITY</span>
              <FaTachometerAlt className="text-[#409ac7] text-xl" />
            </div>
          </div>
        </div>

        {/* Invertor and Battery Card */}
        <div className="bg-[#eff6ff] text-black rounded-xl shadow-lg p-4 w-[360px] h-64 flex flex-col justify-between">
  <div>
    <h3 className="text-xl font-bold text-center mb-2 text-[#409ac7]">Invertor and Battery (%)</h3>
    <div className="space-y-3 text-center text-lg md:text-xl font-semibold text-gray-800">
      <p><span className="font-bold">PV Voltage:</span> {stationLiveData?.PV_voltage?.toFixed(2)}V</p>
      <p><span className="font-bold">Batt. Charge Curr.:</span> {stationLiveData?.battery_charge_curr?.toFixed(2)}A</p>
      <p><span className="font-bold">Inv AC Load:</span> {stationLiveData?.Inv_AC_load?.toFixed(2)}A</p>
    </div>

    <hr className="my-2 border-gray-400" />
  </div>
  <BatteryIndicator />
</div>


        <div className="bg-[#eff6ff] text-black rounded-xl shadow-lg p-6 w-[790px] h-[600px] relative overflow-hidden">
          {/* Top-left image box */}
          <div className="absolute top-6 left-6 bg-white border border-gray-300 shadow-md rounded-lg w-[380px] h-[270px] overflow-hidden">
            <Image
              src={currentStation.image}
              alt="Station"
              fill
              className="object-cover"
            />
          </div>

          {/* Station Image Label */}
          <div className="absolute top-6 left-[400px] flex items-center justify-center w-[360px] h-[270px] text-center opacity-0 animate-[fadeInRight_1s_ease-out_forwards]">
            <div className="relative">
              <p className="text-xl font-bold text-white px-4 py-2 rounded-lg shadow-md bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] backdrop-blur-sm border border-white/30">
                Station Image
              </p>
              {/* Arrow pointing to left image */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[-30px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[15px] border-r-[#3b82f6]" />
            </div>
          </div>

          {/* Bottom-right image box */}
          <div className="absolute bottom-6 right-6 bg-white border border-gray-300 shadow-md rounded-lg w-[380px] h-[270px] overflow-hidden">
            <Image
              src={currentStation.image}
              alt="Live Feed"
              fill
              className="object-cover"
            />
          </div>

          {/* Live Feed Label */}
          <div className="absolute bottom-6 left-[10px] flex items-center justify-center w-[360px] h-[270px] text-center opacity-0 animate-[fadeInLeft_1s_ease-out_forwards]">
            <div className="relative">
              <p className="text-xl font-bold text-white px-4 py-2 rounded-lg shadow-md bg-gradient-to-r from-[#93c5fd] to-[#3b82f6] backdrop-blur-sm border border-white/30">
                Live Feed of the Station
              </p>
              {/* Arrow pointing to right image */}
              <div className="absolute top-1/2 -translate-y-1/2 right-[-30px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[15px] border-l-[#3b82f6]" />
            </div>
          </div>
        </div>
        {/* Current Weather Box - Bottom Left */}
        <div className="absolute bottom-1 left-1 ml-[21px] bg-[#eff6ff] rounded-lg w-[1070px] h-[328px] flex flex-col justify-center items-center p-4">
        <StationGraph station={station} />

        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
