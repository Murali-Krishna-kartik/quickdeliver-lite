export default function About() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans">
      <img
        src="/assets/About.jpg"
        alt="Delivery Service Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-transparent to-pink-600/30" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">About QuickDeliver Lite</h1>
        <p className="max-w-3xl md:text-lg text-gray-300 mb-10 leading-relaxed">
          QuickDeliver Lite is a real-time logistics and delivery tracking system designed with React and Tailwind CSS. It enables customers and drivers to interact securely through a seamless, role-based interface.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl w-full text-sm text-gray-300">
          <div>
            <h2 className="text-white font-semibold mb-2">🚚 What We Do</h2>
            <p>We simplify logistics by allowing customers to create requests and drivers to fulfill them in real-time.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-2">🎯 Our Mission</h2>
            <p>To offer secure, fast, and intuitive logistics service through a scalable, tech-first approach.</p>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-2">🔐 Why Choose Us</h2>
            <ul className="list-disc list-inside">
              <li>Live tracking with role-based access</li>
              <li>Secure login & session management</li>
              <li>Responsive, user-friendly UI</li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-2">⚙️ How It Works</h2>
            <p>Register → Post or Accept Delivery → Track → Mark Complete → Feedback</p>
          </div>
        </div>
      </div>
    </main>
  );
}
