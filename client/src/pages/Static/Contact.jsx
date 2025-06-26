export default function Contact() {
  return (
    <main className="relative w-full min-h-screen overflow-hidden font-sans">
      <img
        src="/assets/Contact.webp"
        alt="Contact Support Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/20 via-transparent to-green-600/20" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-md">Contact Us</h1>
        <p className="max-w-2xl md:text-lg text-gray-300 mb-8">
          Got questions or feedback? We’re here to support your QuickDeliver Lite experience — reach out anytime.
        </p>

        <div className="text-gray-300 text-base space-y-4">
          <p>📧 <strong>Email:</strong> support@quickdeliverlite.com</p>
          <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
          <p>📍 <strong>Location:</strong> Hyderabad, India</p>
        </div>
      </div>
    </main>
  );
}
