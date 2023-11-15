import React, { useEffect } from "react";
import { MdLocalTaxi } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkFirstLogin = () => {
      //   user
      //     ? navigate("/home", { replace: true })
      //     : navigate("/Welcome", { replace: true });
      navigate("/home", { replace: true });
    };
    setTimeout(() => checkFirstLogin(), 5000);
  }, []);
  return (
    <div className="bg-hero flex justify-center flex-col items-center h-full">
      <h3 className="text-3xl font-bold text-blue-500">Polyride</h3>
    </div>
  );
};

export default Splash;
