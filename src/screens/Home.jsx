import React, { useEffect, useState } from "react";
import { BiBuildingHouse, BiLibrary } from "react-icons/bi";
import { FaMosque } from "react-icons/fa";
import { GiOpenGate } from "react-icons/gi";
import { MdMenu } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { TbBusStop } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RideMap from "../components/RideMap";
import Spinner from "../components/Spinner";
import { supabase } from "../utils/supabase";
import { selectUser, setUser } from "./../slices/authSlice";
const locations = [
  {
    title: "Poly Gate",
    lat: 6.8860615289058895,
    lng: 2.9930342203630125,
    icon: <GiOpenGate size={30} />,
  },
  {
    title: "Complex",
    lat: 6.895095454253319,
    lng: 2.981225076264213,
    icon: <TbBusStop size={30} />,
  },
  {
    title: "AUD I",
    lat: 6.894649838652503,
    lng: 2.9893780375882253,
    icon: <BiBuildingHouse size={30} />,
  },
  {
    title: "B Block",
    lat: 6.89421232473923,
    lng: 2.98518322064601,
    icon: <SiGoogleclassroom size={30} />,
  },
  {
    title: "Library",
    lat: 6.896563603681824,
    lng: 2.984145302619502,
    icon: <BiLibrary size={30} />,
  },
  {
    title: "Mosque",
    lat: 6.890183194123656,
    lng: 2.9878295496640126,
    icon: <FaMosque size={30} />,
  },
];

const DestinationCard = ({ name, icon, active, callback }) => {
  return (
    <button
      onClick={callback}
      className={`w-24 h-24 rounded-md ${
        active ? "bg-green-400" : "border border-green-400"
      }  p-1 flex flex-col mb-3 justify-center items-center gap-y-2`}
    >
      {icon}
      <h6 className="text-lg">{name}</h6>
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [activeDestination, setactiveDestination] = useState(0);
  const [currentRide, setCurrentRide] = useState();
  const [newRequest, setNewRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestRide = async () => {
    setLoading(true);
    let { data: profiles, error: profilesErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_type", "driver")
      .eq("is_online", true);

    const { data, error } = await supabase
      .from("rides")
      .insert([
        {
          rider: user.id,
          driver: profiles[0].id,
          price: 500,
          destination: locations[activeDestination].title,
          destination_lat: locations[activeDestination].lat,
          destination_lng: locations[activeDestination].lng,
        },
      ])
      .select();
    if (error) {
      console.log(error);
    }
    console.log(data);

    setLoading(false);
    setCurrentRide(data[0]);
    setNewRequest(true);
  };

  useEffect(() => {
    const rides = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `rider=eq.${user.id}`,
        },
        (payload) => handleRideEvent(payload.new)
      )
      .subscribe();
  });

  const handleRideEvent = async (payload) => {
    console.log("Change received!", payload);
    if (payload.driver === currentRide?.driver) {
      setCurrentRide(payload);
      setNewRequest(false);
    }

    if (currentRide?.status === "declined") {
      setCurrentRide(null);
      setactiveDestination(0);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      <button
        onClick={() => navigate("/history")}
        className="absolute z-30 flex justify-center items-center bg-white shadow-lg p-2 top-3 left-3 rounded-full"
      >
        <MdMenu size={30} />
      </button>
      <div className="h-[55%]">
        <RideMap destination={locations[activeDestination]} />
      </div>
      <div className="h-[45%] px-5">
        <h4 className="text-2xl text-bold pt-8 mb-3">What your destination?</h4>
        <div className="flex flex-wrap justify-between">
          {locations.map((location, index) => (
            <DestinationCard
              key={index}
              name={location.title}
              active={activeDestination === index}
              callback={() => setactiveDestination(index)}
              icon={location.icon}
            />
          ))}
        </div>

        <button
          onClick={requestRide}
          disabled={
            loading ||
            newRequest ||
            currentRide?.status === "on-route" ||
            currentRide?.status === "picked-up" ||
            currentRide?.status === "payment"
          }
          className="w-full bg-green-800 py-4 rounded-md disabled:bg-gray-400 text-white text-lg"
        >
          {loading ? (
            <Spinner />
          ) : newRequest ? (
            "You have an ongoing request"
          ) : currentRide?.status === "on-route" ? (
            "Your Driver is on the way"
          ) : currentRide?.status === "picked-up" ? (
            "You are now on route"
          ) : currentRide?.status === "payment" ? (
            "Destination Reached Make Payment"
          ) : (
            "Request Driver"
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;
