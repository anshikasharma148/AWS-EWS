'use client';
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { MapPin, Plus } from "lucide-react";
import Image from "next/image";
import vishnuImg from "../../public/images/vishnu.png";
import manaImg from "../../public/images/mana.png";
import binaImg from "../../public/images/bina.png";
import vasudharaImg from "../../public/images/vasudhara.png";
import ParameterGraphs from "../../components/ParameterGraphs";
import Link from "next/link";

const stationImages = {
  "Vishnu Prayag": vishnuImg,
  "Mana": manaImg,
  "Binakuli": binaImg,
  "Vasudhara": vasudharaImg
};

export default function AwsPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/stations')
        .then(res => res.json())
        .then(data => {
          const roundedData = data.map(station => ({
            ...station,
            temperature: Number(station.temperature).toFixed(1),
            pressure: Number(station.pressure).toFixed(1),
            humidity: Number(station.humidity).toFixed(1),
            rain: Number(station.rain).toFixed(1),
            snow: Number(station.snow).toFixed(1),
            wind_speed: Number(station.wind_speed).toFixed(1),
            wind_direction: station.wind_direction
          }));
          setStations(roundedData);
        })
        .catch(err => console.error("Error fetching station data:", err));
    };

    // Initial fetch
    fetchData();

    // Set an interval to fetch new data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000); // 5 minutes

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <video
  autoPlay
  loop
  muted
  playsInline
  className="fixed top-0 left-0 w-full h-full object-cover z-[-20]"
>
  <source src="/videos/dashvideo.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

      <div className="absolute z-[-10] w-full h-full overflow-hidden">
        {["0s", "10s", "20s", "5s", "15s", "25s"].map((delay, i) => (
          <div key={i} className={`cloud ${i % 2 === 0 ? 'cloud-small' : 'cloud-large'}`} style={{ top: `${5 + i * 5}%`, left: `${-100 - i * 50}px`, animationDelay: delay }} />
        ))}
      </div>

      <Navbar />

      <div className="flex flex-col items-center text-center pt-28">
        <h1 className="text-5xl font-bold tracking-wide text-white drop-shadow-sm animate-fade-slide">
          <span className="inline-block text-7xl font-extrabold text-yellow-400">A</span>utomated
          <span className="ml-4 text-7xl font-extrabold text-yellow-400">W</span>eather
          <span className="ml-4 text-7xl font-extrabold text-yellow-400">S</span>ystem
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 px-10 relative">
        {stations.map((station, index) => (
          <div key={index} className="group relative overflow-hidden border shadow-md rounded-[40px] p-8 min-w-[320px] h-[550px] bg-white hover:scale-[1.04] transition-transform duration-300 ease-in-out flex flex-col justify-between">
            <div
              className="absolute inset-0 z-0 transition-transform duration-500 ease-in-out scale-100 translate-y-full group-hover:translate-y-0 group-hover:scale-110 rounded-2xl"
              style={{
                backgroundImage: stationImages[station.name] ? `url(${stationImages[station.name].src})` : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.7
              }}
            />
            <div className="relative z-10 flex flex-col h-full justify-between text-[#409ac7]">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-3xl font-bold transition-all duration-300 group-hover:text-white">
                  <MapPin size={24} className="mr-2" />
                  <a href={`/aws/${station.name.toLowerCase().replace(/\s+/g, '-')}`} className="font-bold hover:underline hover:text-yellow-400 transition duration-300">{station.name}</a>
                </div>
                <div className="flex items-center space-x-2">
                  <Image src="/gifs/SUN.gif" alt="Temperature" width={70} height={70} />
                  <span className="text-4xl font-bold text-black">{station.temperature}°C</span>
                </div>
              </div>
              <div className="transition-all duration-300 group-hover:bg-white group-hover:shadow-2xl group-hover:border group-hover:border-black rounded-[30px] py-4 px-3 grid grid-cols-1 gap-4 mb-4">
                {[{ label: "Pressure", value: station.pressure, gif: "/gifs/pressure.gif" },
                  { label: "Humidity", value: station.humidity, gif: "/gifs/humid.gif" },
                  { label: "Rain", value: station.rain, gif: "/gifs/rain.gif" },
                  { label: "Snow", value: station.snow, gif: "/gifs/snow.gif" },
                  { label: "Wind Speed", value: station.wind_speed, gif: "/gifs/windspeed.gif" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 min-h-[40px]">
                    <Image src={item.gif} alt={item.label} width={50} height={50} />
                    <span className="text-lg font-bold text-gray-700 group-hover:text-black w-full">{item.label}: <b>{item.value}</b></span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center px-6 py-3 bg-white rounded-full border shadow text-gray-600 w-fit mx-auto transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:scale-105">
                <Image src="/gifs/winddir.gif" alt="Wind Direction" width={40} height={40} className="mr-2" />
                <span className="text-lg font-bold">Wind Dir: <b>{station.wind_direction}</b></span>
              </div>
            </div>
          </div>
        ))}

        <Link href="/aws/add-station" className="absolute right-8 -bottom-16 flex items-center bg-gray-200 text-black rounded-full px-5 py-3 shadow-lg hover:scale-105 transition-transform">
          <Plus size={24} className="mr-2" />
          <span className="font-bold text-lg">Add More Stations</span>
        </Link>
      </div>

      <div className="flex flex-col items-center mt-[15rem] px-6 mb-12">
        <h2 className="text-5xl font-bold text-white drop-shadow-lg animate-fade-slide">
          <span className="text-7xl text-yellow-400 font-extrabold">W</span>eather <span className="text-7xl text-yellow-400 font-extrabold">T</span>rends
        </h2>
      </div>

      <div className="w-full mb-6 px-6">
        <ParameterGraphs stations={stations} />
      </div>

      <style jsx>{`
        .cloud {
          position: absolute;
          background: url('/images/cloud.png') no-repeat center / contain;
          opacity: 0.4;
          animation: floatCloud 80s linear infinite;
        }
        .cloud-small { width: 100px; height: 60px; }
        .cloud-large { width: 200px; height: 120px; }

        @keyframes floatCloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(160vw); }
        }
        .animate-fade-slide {
          animation: fadeSlideUp 1s ease-out forwards;
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
