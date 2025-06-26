export default function PrivacyPolicy() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans">
      <img
        src="/assets/privacy.webp"
        alt="Privacy Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-600/20" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">Privacy Policy</h1>
        <p className="max-w-2xl text-sm md:text-base text-gray-300">
          Your privacy matters to us. QuickDeliver Lite collects only essential information required for smooth logistics and account management. We never share your data without your consent. Security and transparency are at the heart of our service.
        </p>
      </div>
    </main>
  );
}
