export default function Licensing() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans">
      <img
        src="/assets/Licensing.jpg"
        alt="Licensing Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-red-600/20" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">Licensing Information</h1>
        <p className="max-w-2xl text-sm md:text-base text-gray-300">
          QuickDeliver Lite is a non-commercial educational project created during an internship program. All content and code are used for learning purposes only. Please do not use or distribute for commercial intent without prior permission.
        </p>
      </div>
    </main>
  );
}
