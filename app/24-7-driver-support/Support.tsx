import Loginform from "../loginform/form";

export default function Support() {
  return (
    <section className="w-full dark:bg-gray-900 bg-gray-100 py-16">

      <div className="w-full bg-[#2f6f66] text-white text-center py-5 text-xl font-semibold tracking-wide">
        Get in Touch with DriverX
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center">
          Have questions about our plans, need support, or want to explore partnership opportunities?
          We’re here to help. Reach out to our driver-first support team for quick assistance, expert
          guidance, or custom solutions tailored to your needs. Whether you’re an individual driver,
          fleet operator, or business partner, we’re just a message or call away.
        </p>
      </div>
<br />
      <Loginform />

    </section>
  );
}