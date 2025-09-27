import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Photostrip from "../pages/Photostrip"; // adjust path if needed
import html2canvas from "html2canvas";
import { Camera, RefreshCcw, Download, RotateCcw, ArrowLeft } from "lucide-react";

export default function Photobooth() {
  const webcamRef = useRef(null);
  const navigate = useNavigate(); // for navigation
  const [photos, setPhotos] = useState([]);
  const [facingMode, setFacingMode] = useState("user");
  const [filter, setFilter] = useState("none");

  const filterOptions = [
    { name: "None", value: "none" },
    { name: "Grayscale", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(100%)" },
    { name: "Invert", value: "invert(100%)" },
    { name: "Bright", value: "brightness(150%)" },
    { name: "Contrast", value: "contrast(150%)" },
    { name: "Blur", value: "blur(3px)" },
  ];

  const capturePhoto = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (!video) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.filter = filter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL("image/png");
        setPhotos((prev) => [...prev, imageSrc]);
      }
    }
  };

  const resetStrip = () => setPhotos([]);
  const downloadStrip = () => {
    const strip = document.getElementById("photostrip");
    if (!strip) return;

    html2canvas(strip, { useCORS: true, scale: 2 }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "photostrip.png";
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    });
  };
  const flipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black flex flex-col items-center p-6 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="self-start mb-4 flex items-center gap-2 text-white hover:text-gray-300 font-semibold"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
        Photobooth
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl justify-center items-start">
        {/* Camera & Controls */}
        <div className="flex flex-col items-center w-full lg:w-2/3 bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
          {photos.length < 4 && (
            <div className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={false}
                screenshotFormat="image/png"
                videoConstraints={{
                  facingMode,
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                }}
                className="w-full h-full object-cover"
                style={{ filter }}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-3 mt-6 overflow-x-auto w-full justify-center pb-2">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`min-w-[90px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                  filter === f.value
                    ? "bg-indigo-600 border-indigo-400 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
                style={{ filter: f.value }}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6 flex-wrap justify-center w-full">
            {photos.length < 4 ? (
              <>
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold shadow-lg transition"
                >
                  <Camera size={20} /> Capture
                </button>
                <button
                  onClick={flipCamera}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-lg transition"
                >
                  <RotateCcw size={20} /> Flip
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={downloadStrip}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg transition"
                >
                  <Download size={20} /> Download
                </button>
                <button
                  onClick={resetStrip}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold shadow-lg transition"
                >
                  <RefreshCcw size={20} /> Retake
                </button>
              </>
            )}
          </div>
        </div>

        {/* Photostrip Panel */}
        <div className="flex justify-center lg:justify-start w-full lg:w-1/3">
          <Photostrip photos={photos} />
        </div>
      </div>
    </div>
  );
}
