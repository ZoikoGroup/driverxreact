function Loginform() {
  return (
    <div className="h-screen w-full flex">
      
      {/* Left Side - Full Height Map Image */}
      <div className="w-1/2 h-full">
        <img
          src="/images/image 232.png"
          alt="Map"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-1/2 h-full bg-teal-800 flex items-center px-20">
        <div className="w-full max-w-md">
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Let’s Talk
          </h1>

          <p className="text-gray-200 text-sm mb-10">
            Fill up the form our team will get back to you within 24 Hours
          </p>

          <form className="space-y-6">

            {/* First + Last Name */}
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your Email Address"
                className="w-full px-4 py-3 rounded-md bg-gray-200 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                placeholder="Enter your Messages"
                rows={5}
                className="w-full px-4 py-3 rounded-md bg-gray-200 resize-none focus:outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-teal-800 transition"
            >
              Send Messages
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginform;
