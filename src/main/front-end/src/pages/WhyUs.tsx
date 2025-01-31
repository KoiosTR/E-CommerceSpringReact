export default function WhyUs() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Why Choose Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quality Products</h2>
            <p className="text-gray-600">We carefully select each product to ensure the highest quality for our customers.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Fast Shipping</h2>
            <p className="text-gray-600">Get your orders quickly with our efficient shipping process.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
            <p className="text-gray-600">Our dedicated team is here to help you with any questions or concerns.</p>
          </div>
        </div>
      </div>
    </div>
  );
}