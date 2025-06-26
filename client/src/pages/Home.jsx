import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    src: "https://cdn.pixabay.com/photo/2023/02/18/16/02/bicycle-7798227_1280.jpg",
    headline: "Fast & Reliable Delivery for Everyone",
  },
  {
    src: "https://cdn.pixabay.com/photo/2018/05/15/09/01/foodora-3402507_1280.jpg",
    headline: "Track Your Packages in Real Time",
  },
  {
    src: "https://cdn.pixabay.com/photo/2022/01/08/19/46/delivery-6924735_1280.jpg",
    headline: "Join as a Customer or Driver Today",
  },
];

export default function Home() {
  return (
    <main className="w-full font-sans bg-black text-white">
      {/* Carousel Section */}
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={1000}
        transitionTime={800}
        showArrows={false}
        stopOnHover
        emulateTouch
        className="z-0"
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative w-full h-[90vh]">
            <img
              src={slide.src}
              alt={slide.headline}
              className="w-full h-full object-cover brightness-75"
              draggable="false"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-4">
                {slide.headline}
              </h2>
              <Link to="/register">
                <button className="bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-full text-white font-semibold text-lg shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Feature Section */}
      <section className="bg-gray-900 py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Why QuickDeliver Lite?
        </h2>
        <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-indigo-500 transition">
            <h3 className="text-xl font-semibold mb-2">🚀 Fast Delivery</h3>
            <p className="text-gray-300">
              Swift, on-time deliveries with real-time updates.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-purple-500 transition">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure & Tracked</h3>
            <p className="text-gray-300">
              Package tracking with full visibility from start to finish.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-pink-500 transition">
            <h3 className="text-xl font-semibold mb-2">🤝 Easy to Use</h3>
            <p className="text-gray-300">
              Simple for customers and drivers with clear dashboards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
