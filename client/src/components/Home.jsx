import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate()
  return (
    <div className="bg-[#040b35] min-h-screen flex gap-10">
      <img src="/hero.jfif" alt="hero-bg" className="h-screen opacity-80" />
      <div className="flex flex-col py-20 items-center">
        <h1 className="text-5xl text-[#cba094]">Blowfish Image Encryption</h1>
        <div className="flex flex-col gap-10 mt-20">
          <button
            className="w-full border-2 border-[#cba094] px-20 cursor-pointer py-5 rounded-xl text-xl text-[#cba094]"
            onClick={(e) => {
              e.preventDefault();
              nav("/encrypt");
            }}
          >
            Encrypt an Image
          </button>
          <div className="flex gap-2 items-center">
            <div className="h-1 bg-[#8d5e75] w-full"></div>
            <div className="text-[#8d5e75]">OR</div>
            <div className="h-1 bg-[#8d5e75] w-full"></div>
          </div>
          <button
            className="w-full border-2 border-[#cba094] px-20 cursor-pointer py-5 rounded-xl text-xl text-[#cba094]"
            onClick={(e) => {
              e.preventDefault();
              nav("/decrypt");
            }}
          >
            Decrypt an Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
