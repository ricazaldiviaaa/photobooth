import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Photostrip from "../pages/Photostrip"; // adjust path if needed
import html2canvas from "html2canvas";
import { Camera, RefreshCcw, Download, RotateCcw, ArrowLeft } from "lucide-react";

export default function Photobooth() {
  const webcamRef = useRef(null);
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

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [...prev, reader.result]);
    };
    reader.readAsDataURL(file);
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

  const goBack = () => {
    setPhotos([]);
    setFilter("none");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">Photobooth</h1>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-7xl justify-center items-start">
        {/* Camera Panel */}
        <div className="flex flex-col items-center w-full lg:w-2/3 bg-white rounded-3xl p-6 shadow-lg">
          {/* Back Button */}
          <button
            onClick={goBack}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Camera Preview */}
          {photos.length < 4 && (
            <div className="w-full max-w-xl aspect-video rounded-2xl overflow-hidden shadow-md bg-gray-100">
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

          {/* Upload Image */}
          <label className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-gray-700">
            Upload from Gallery
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>

          {/* Filters */}
          <div className="flex gap-3 mt-6 overflow-x-auto w-full justify-center pb-2">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`min-w-[90px] px-3 py-2 rounded-lg border-2 text-sm font-medium transition ${
                  filter === f.value
                    ? "bg-indigo-500 border-indigo-400 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
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
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold shadow transition"
                >
                  <Camera size={20} /> Capture
                </button>
                <button
                  onClick={flipCamera}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl font-semibold shadow transition"
                >
                  <RotateCcw size={20} /> Flip
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={downloadStrip}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold shadow transition"
                >
                  <Download size={20} /> Download
                </button>
                <button
                  onClick={resetStrip}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl font-semibold shadow transition"
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
