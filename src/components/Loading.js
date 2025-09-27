import { useEffect, useState } from "react";

export default function BoxRippleLoading() {
  const [progress, setProgress] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : prev));
      }, 25); // speed
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => setShowAbout(true), 800);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0f172a] text-white">
      {/* Nested ripple boxes */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 border-4 border-pink-500 animate-boxRipple"></div>
        <div className="absolute w-24 h-24 border-4 border-pink-400 animate-boxRipple delay-200"></div>
        <div className="absolute w-16 h-16 border-4 border-pink-300 animate-boxRipple delay-400"></div>
        <div className="absolute w-8 h-8 bg-pink-500 rounded-sm animate-pulse"></div>
      </div>

      {/* Progress */}
      <p className="text-lg font-semibold tracking-wide">
        Loading {progress}%
      </p>
    </div>
  );
}
