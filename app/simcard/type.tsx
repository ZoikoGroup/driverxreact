import { dirxml } from "console";

function Simcard(){

    return(
           <section className="w-full py-20 bg-gradient-to-r from-yellow-50 via-green-50 to-green-100">
      <div className="max-w-5xl mx-auto text-center px-4">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Activate Your GoLite Mobile SIM
        </h1>

        <p className="text-gray-600 mb-6 text-lg">
          Get started with your GoLite connection in just a few simple steps.
        </p>

        <h2 className="text-teal-600 font-semibold text-xl mb-12">
          Select Your SIM Type
        </h2>

        {/* Cards */}
        <div className="flex flex-col md:flex-row justify-center gap-10">

          {/* pSIM Card */}
          <div className="bg-white border-2 border-teal-600 rounded-2xl w-72 h-60 flex flex-col items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer">
            <div className="text-teal-600 text-5xl mb-4">
                <img
            src="/images/Vector (1).png"
            alt="pssim.png"
            className="w-full max-w-[520px] h-auto object-cover rounded-3xl shadow-xl"
          />
            </div>
            <h3 className="text-2xl font-semibold text-teal-700">pSIM</h3>
          </div>

          {/* eSIM Card */}
          <div className="bg-white border-2 border-teal-600 rounded-2xl w-72 h-60 flex flex-col items-center justify-center shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer">
            <div className="text-teal-600 text-5xl mb-4">   
                <img
            src="/images/Vector (2).png"
            alt="pssim.png"
            className="w-full max-w-[520px] h-auto object-cover rounded-3xl shadow-xl"
          /></div>
            <h3 className="text-2xl font-semibold text-teal-700">eSIM</h3>
          </div>

        </div>
      </div>
    </section>
    );
}
export default Simcard