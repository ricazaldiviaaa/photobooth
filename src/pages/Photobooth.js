import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Photostrip from "../pages/Photostrip"; // adjust path if needed
import html2canvas from "html2canvas";
import { Camera, RefreshCcw, Download } from "lucide-react";

export default function Photobooth() {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [facingMode, setFacingMode] = useState("user");
  const [orientation, setOrientation] = useState("portrait");
  const [filter, setFilter] = useState("none"); // selected filter

  const aspectRatio = 3 / 4;

  const filterOptions = [
    { name: "None", value: "none" },
    { name: "Grayscale", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(100%)" },
    { name: "Invert", value: "invert(100%)" },
    { name: "Bright", value: "brightness(150%)" },
    { name: "High Contrast", value: "contrast(150%)" },
    { name: "Blur", value: "blur(3px)" },
  ];

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    };
    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-4xl font-extrabold mb-8">Photobooth</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {/* Left: Camera */}
        <div className="flex flex-col items-center">
          {photos.length < 4 && (
            <div className="w-[280px] h-[160px] rounded-2xl overflow-hidden shadow-lg bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                screenshotQuality={1}
                mirrored={false}
                videoConstraints={{
                  facingMode: facingMode,
                  aspectRatio: 7 / 4,
                  width: { ideal: 1920 },
                  height: { ideal: 1080 },
                }}
                className="w-full h-full object-cover"
                style={{
                  transform: "rotate(0deg) scaleX(1)",
                  filter: filter,
                }}
              />
            </div>
          )}

          {/* Filter buttons below camera */}
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {filterOptions.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`w-14 h-14 rounded-xl border-2 ${
                  filter === f.value ? "border-blue-500" : "border-gray-400"
                } overflow-hidden shadow-md flex items-center justify-center flex-col cursor-pointer`}
                style={{ filter: f.value }}
              >
                <div className="text-xs font-bold text-white">{f.name}</div>
              </button>
            ))}
          </div>

          {/* Capture / Flip / Download / Retake buttons */}
          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            {photos.length < 4 ? (
              <>
                <button
                  onClick={capturePhoto}
                  className="flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold shadow-lg transition"
                >
                  <Camera size={20} /> Capture
                </button>
                <button
                  onClick={flipCamera}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-semibold shadow-lg transition"
                >
                  Flip
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

        {/* Right: Photostrip */}
        <Photostrip photos={photos} />
      </div>
    </div>
  );
}
