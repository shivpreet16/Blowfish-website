import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Encrypt.css";

const Encrypt = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [key, setKey] = useState("");
  const [enc, setEnc] = useState("");
  const [imgUrl, setImgUrl] = useState(null);

  const handleFileChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImgUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("key", key);
    const url = "http://127.0.0.1:5000/encrypt";

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await response;
      setEnc(data.data.data);
    } catch (error) {
      console.error("Error uploading image and key:", error);
    }
  };

  const handleCopyClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(enc);
    alert(
      "Copied encrypted array to clipboard! Do not forget to share your key as well"
    );
  };

  const nav = useNavigate();

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
          Image Encryption using Blowfish
        </h2>
        <div className="flex gap-20">
          <form
            id="form-file-upload"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <input
              type="file"
              id="input-file-upload"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleFileChange}
            />
            <label
              id="label-file-upload"
              htmlFor="input-file-upload"
              className="py-10"
            >
              {imgUrl ? (
                <div className="flex flex-col gap-5 items-center">
                  <img src={imgUrl} className="h-32 w-32" />
                  <button
                    className="border py-1 px-2 rounded-xl text-[#ea6969] border-[#ea6969] w-fit"
                    onClick={(e) => {
                      e.preventDefault();
                      setImgUrl(null);
                      setSelectedFile(null);
                      document.getElementById("input-file-upload").value = "";
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-xl">Click here to upload</p>
              )}
            </label>
            <div className="flex gap-5 items-center justify-center">
              <input
                type="text"
                placeholder="Key"
                className="bg-transparent border focus:outline-none text-[#9bb7e4] border-[#9bb7e4] px-2 py-2 "
                onChange={handleKeyChange}
              />
              <button
                className="w-fit bg-[#9bb7e4] px-2 py-2 text-[#592d20]"
                type="submit"
              >
                Encrypt
              </button>
            </div>
          </form>
          <div className="h-96 w-full bg-[#051e54] rounded-xl border-dashed border-[#1a9acc] border-2 flex flex-col items-center justify-center">
            <span className="text-[#cba094] text-xl font-medium py-2">
              Encrypted text
            </span>
            <div
              className="overflow-x-hidden h-3/4 px-5 cursor-copy"
              onClick={handleCopyClick}
            >
              <span className="text-[#9bb7e4]">
                {enc}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encrypt;
