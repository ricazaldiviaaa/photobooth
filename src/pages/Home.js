import { Camera, Sliders, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center text-white p-10">
      {/* Hero Section */}
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 animate-fadeIn">
          Welcome to <span className="text-pink-400">PhotoBooth</span>
        </h1>
        <p className="text-lg text-gray-200 mb-8 animate-fadeIn delay-200">
          Capture your best moments with customizable filters, creative effects,
          and an elegant interface designed for fun.
        </p>

        {/* Call to Action */}
        <a
          href="/photobooth"
          className="px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-105 inline-block animate-fadeIn delay-400"
        >
          Enter Photobooth
        </a>
      </div>

      {/* Showcase Preview */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn delay-600">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition flex flex-col items-center">
          <Sliders className="w-10 h-10 text-pink-400 mb-3" />
          <h2 className="text-xl font-bold mb-2">Filters</h2>
          <p className="text-gray-200 text-sm text-center">
            Add stylish filters and color tones to enhance your photos.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition flex flex-col items-center">
          <Sparkles className="w-10 h-10 text-pink-400 mb-3" />
          <h2 className="text-xl font-bold mb-2">Effects</h2>
          <p className="text-gray-200 text-sm text-center">
            Apply glitch, neon, and artistic effects instantly.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:scale-105 transition flex flex-col items-center">
          <Camera className="w-10 h-10 text-pink-400 mb-3" />
          <h2 className="text-xl font-bold mb-2">Instant Capture</h2>
          <p className="text-gray-200 text-sm text-center">
            Take crisp snapshots directly from your device camera.
          </p>
        </div>
      </div>
    </div>
  );
}
