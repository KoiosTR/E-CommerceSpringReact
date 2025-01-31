export default function Address() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Location</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <strong>Address:</strong><br />
                  123 Fashion Street<br />
                  Istanbul, Turkey 34000
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong><br />
                  +90 (212) 555-0123
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong><br />
                  info@shopstyle.com
                </p>
              </div>
            </div>
            <div className="h-64 md:h-auto bg-gray-200 rounded-lg">
              {/* Here you would typically embed a map */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Map Placeholder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}