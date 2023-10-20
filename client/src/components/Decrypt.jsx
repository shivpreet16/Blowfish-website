import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Decrypt = () => {
  const [encryptedData, setEncryptedData] = useState("");
  const [imageData, setImageData] = useState("");
  const [key, setKey] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("data", encryptedData);
    formData.append("key", key);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/decrypt",
        formData,
        {
          responseType: "arraybuffer",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response;
      const contentType = response.headers["content-type"];
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const dataUrl = `data:${contentType};base64,${base64}`;

      const blob = new Blob([response.data], { type: "image/png" });
      const imgURL = URL.createObjectURL(blob);
      setImageData(imgURL);
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  return (
    <div className="bg-[#040b35] min-h-screen flex flex-col relative">
      <img
        src="/fish.png"
        alt="fish"
        className="h-28 w-28 cursor-pointer absolute"
        onClick={() => {
          nav("/");
        }}
      />
      <div className="flex flex-col items-center gap-10 min-w-screen mt-10">
        <h2 className="text-4xl text-[#cba094] font-medium">
          Image Decryption using Blowfish
        </h2>
        <div className="flex gap-10">
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <textarea
              name="encryptedMatrix"
              id=""
              cols="30"
              rows="10"
              className="focus:outline-none px-2 py-2 bg-[#051e54] border-2 text-[#1a9acc] border-dashed border-[#1a9acc]"
              onChange={(e) => {
                setEncryptedData(e.target.value);
              }}
              placeholder="Enter your encrypted array in place of this text"
            ></textarea>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Key"
                className="bg-transparent border focus:outline-none text-[#9bb7e4] border-[#9bb7e4] px-2 py-2 "
                onChange={(e) => {
                  setKey(e.target.value);
                }}
              />
              <button
                className="w-fit bg-[#9bb7e4] px-2 py-2 text-[#592d20]"
                type="submit"
              >
                Decrypt
              </button>
            </div>
          </form>
          <img src={imageData} alt="" className="h-72 w-72 bg-[#051e54] border-dashed border-[#1a9acc] border-2" />
        </div>
      </div>
    </div>
  );
};

export default Decrypt;
