function Loginform() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center p-8">
      <div className="flex items-center gap-12 max-w-6xl w-full">
        {/* Left side - Image */}
        <div className="flex-1">
          <img
            src="/images/image 232.png"
            alt="Driver using phone"
            className="w-full max-w-[520px] h-auto object-cover rounded-3xl shadow-xl"
          />
        </div>

        {/* Right side - Form */}
        <div className="flex-1">
          <div className="bg-teal-700 rounded-lg p-10 max-w-lg w-full">
            <h1 className="text-4xl font-bold text-white mb-3">
              Let's Talk
            </h1>

            <p className="text-white text-sm mb-8">
              Fill up the form our team will get back to you within 24 Hours
            </p>

            <form className="space-y-5">
              {/* First Name and Last Name - Side by Side */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your First Name"
                    className="w-full px-4 py-3 border-0 rounded-lg outline-none transition bg-white text-gray-700 placeholder:text-gray-400"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your Last Name"
                    className="w-full px-4 py-3 border-0 rounded-lg outline-none transition bg-white text-gray-700 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your Email Address"
                  className="w-full px-4 py-3 border-0 rounded-lg outline-none transition bg-white text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Enter your Messages"
                  rows={5}
                  className="w-full px-4 py-3 border-0 rounded-lg outline-none transition resize-none bg-white text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-teal-700 transition duration-200"
              >
                Send Messages
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginform;