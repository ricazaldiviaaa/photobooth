import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Photostrip from "../pages/Photostrip"; // make sure this path is correct
import html2canvas from "html2canvas";
import { Camera, RefreshCcw, Download } from "lucide-react";

export default function Photobooth() {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [facingMode, setFacingMode] = useState("user");
  const [orientation, setOrientation] = useState("portrait");

  // 🔄 detect device orientation
  useEffect(() => {
    const updateOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation("landscape");
      } else {
        setOrientation("portrait");
      }
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
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos((prev) => [...prev, imageSrc]);
      } else {
        alert("Camera not ready, try again.");
      }
    }
  };

  const resetStrip = () => {
    setPhotos([]);
  };

  const downloadStrip = () => {
    const strip = document.getElementById("photostrip");
    if (!strip) return;

    html2canvas(strip, { useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "photostrip.png";
      link.href = canvas.toDataURL("image/png");
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
            <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/png"
                screenshotQuality={1}
                className={`w-full ${
                  orientation === "landscape" ? "rotate-0" : "rotate-0"
                }`}
                mirrored={false} // 🚫 disable browser mirror
                videoConstraints={{
                  facingMode: facingMode,
                  width: 640,
                  height: 480,
                }}
                style={{
                  transform:
                    orientation === "landscape"
                      ? "rotate(0deg) scaleX(1)" // ✅ keep upright in landscape
                      : "rotate(0deg) scaleX(1)", // ✅ no mirror in portrait
                  objectFit: "cover",
                }}
              />
            </div>
          )}

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
