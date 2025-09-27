export default function Photostrip({ photos }) {
  return (
    <div
      id="photostrip"
      className="relative w-[280px] h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-200 flex flex-col justify-between p-4"
    >
      {/* Header */}
      <div className="text-center text-gray-700 font-bold text-lg mb-2">
        PhotoBooth
      </div>

      {/* Photo Slots */}
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-xl overflow-hidden shadow-md h-[160px]"
          >
            {photos[i] ? (
              <img
                src={photos[i]}
                alt={`slot-${i}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Empty</span>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-2">
        www.myphotobooth.com
      </div>
    </div>
  );
}
