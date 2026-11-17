"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Zap,
  Navigation,
  Smartphone,
  MessageSquare,
  Layers,
  Car,
  ShoppingBag,
  Briefcase,
  Truck,
  Plane,
  Wifi,
  MapPin,
  Share2,
  RefreshCw,
  Headphones,
  BadgePercent,
} from "lucide-react";

const faqList = [
  {
    q: "What is the DriverX Mobile 35% introductory offer?",
    a: "DriverX Mobile's promotional offer provides eligible customers with 35% off eligible driver-plan charges for the first three months.",
  },
  {
    q: "How long does the DriverX Mobile discount last?",
    a: "The introductory discount applies to eligible driver-plan charges during the first three months, subject to the applicable promotional terms.",
  },
  {
    q: "Does DriverX Mobile waive activation fees?",
    a: "Eligible new lines may qualify for an activation-fee waiver where commercially approved. Customers should confirm eligibility before activation.",
  },
  {
    q: "Who can benefit from DriverX Mobile plans?",
    a: "DriverX Mobile offers solutions for gig workers, delivery drivers, rideshare professionals, fleet operators and other mobile professionals.",
  },
  {
    q: "Can I explore different DriverX Mobile plans?",
    a: "Yes. Customers can explore prepaid, postpaid, business and data-only options through the official plans page.",
  },
  {
    q: "Why is mobile connectivity important for delivery drivers?",
    a: "Delivery drivers use mobile connectivity for navigation, order management, customer communication and accessing delivery applications.",
  },
  {
    q: "Where can I find more information about DriverX Mobile?",
    a: "Visit www.driverxmobile.com to explore its services, available plans and contact information.",
  },
];

const linkClass =
  "text-teal-700 dark:text-teal-400 font-semibold underline underline-offset-2 hover:text-teal-900 dark:hover:text-teal-300";

export default function Blog5() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <article className="bg-[#f7f9f7] dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Title Banner */}
      <div className="bg-[#0f766e] text-white text-center py-4 px-4">
        <h1 className="font-semibold text-lg sm:text-xl max-w-4xl mx-auto">
          Drive Smarter and Save More: Get 35% Off DriverX Mobile Plans for Three Months
        </h1>
      </div>

      {/* Hero Image */}
      <div className="flex justify-center mt-6 px-6">
        <img
          src="/images/new/DriverX-branded delivery vans parked at a logistics depot at sunrise.png"
          alt="DriverX Mobile branded delivery vans parked at a logistics depot at sunrise"
          className="w-full max-w-[520px] md:max-w-[680px] h-auto object-cover rounded-3xl"
        />
      </div>

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 leading-relaxed">
        {/* Quick Summary Callout */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border-l-4 border-[#0f766e] shadow-sm">
          <div className="flex items-center gap-2 text-[#0f766e] dark:text-teal-400 font-bold text-xl mb-3">
            <Zap className="w-5 h-5" />
            <h2>Quick Summary</h2>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Exclusive introductory savings:</strong> Eligible customers can get 35% off DriverX Mobile eligible driver-plan charges for the first three months.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Activation-fee benefit:</strong> Eligible new lines may qualify for a waived activation fee, subject to commercial approval.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Designed for drivers:</strong> DriverX Mobile offers connectivity solutions for rideshare drivers, delivery professionals, gig workers and fleet operators.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Stay connected:</strong> Explore mobile solutions for navigation, communication, delivery applications and everyday work requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span><strong>Explore available plans:</strong> Visit <Link href="/" className={linkClass}>DriverX Mobile</Link> to discover available plans and confirm promotional eligibility.</span>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 font-medium">
            Looking for affordable driver mobile plans? Explore DriverX Mobile&apos;s introductory offer and discover how you could save on eligible mobile plan charges while staying connected on the road.
          </div>
        </section>

        {/* Intro */}
        <section className="space-y-4 text-base sm:text-lg text-gray-700 dark:text-gray-300">
          <p>
            Staying connected is essential for today&apos;s professional drivers. Whether you work in rideshare, food delivery, freight transportation, logistics or other mobile professions, your smartphone plays an important role in managing your daily activities. From accessing navigation and accepting customer requests to communicating with clients and tracking deliveries, reliable mobile connectivity helps keep your work moving.
          </p>
          <p>
            However, maintaining a dependable mobile connection can become an ongoing expense, particularly for drivers who spend several hours on the road every day.
          </p>
          <p>
            That&apos;s where DriverX Mobile aims to make a difference. With its latest promotional offer, eligible customers can enjoy 35% off eligible driver-plan charges for the first three months, helping reduce initial mobile connectivity costs. Eligible new lines may also qualify for an activation-fee waiver, subject to commercial approval.
          </p>
          <p>
            For drivers looking to manage their mobile expenses while maintaining access to essential connectivity, this introductory offer provides an opportunity to explore driver-focused mobile solutions.
          </p>
          <p>
            Discover how DriverX Mobile helps drivers stay connected and how you can take advantage of this limited introductory saving opportunity.
          </p>
        </section>

        {/* Save 35% */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Save 35% on Eligible DriverX Mobile Plans for Three Months
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Managing expenses is an important part of working as an independent driver or transportation professional. Mobile connectivity is one of the everyday costs that can support your work, making it worthwhile to explore plans and offers that provide better value.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            With the DriverX Mobile introductory promotion, eligible customers can receive 35% off eligible driver-plan charges for their first three months.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            This promotional saving gives qualifying new customers an opportunity to experience DriverX Mobile while reducing their eligible plan charges during the introductory period.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            For example, drivers who regularly depend on their smartphones for navigation, delivery applications, communication and other work-related activities can explore suitable mobile plan options while benefiting from the promotional discount.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            In addition, eligible new lines may qualify for a waived activation fee where commercially approved. This provides another potential opportunity to reduce the initial cost of getting started.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BadgePercent className="w-5 h-5 text-teal-600" /> The key benefits of this promotional offer include:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {[
                "35% off eligible driver-plan charges for the first three months.",
                "Potential activation-fee savings for eligible new lines, subject to commercial approval.",
                "An opportunity to explore driver-focused mobile connectivity.",
                "Access to mobile solutions designed around the needs of working drivers.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Customers should check the applicable promotional terms, eligible plans and activation conditions before purchasing.
          </p>
        </section>

        {/* Why Mobile Connectivity Matters */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Why Mobile Connectivity Matters for Professional Drivers
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            For professional drivers, a smartphone is much more than a communication device. It is an essential work tool that supports daily operations and helps manage different responsibilities throughout the day.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Consider a delivery driver completing multiple orders. They may need to access a delivery application, follow GPS directions, communicate with customers and check updated delivery instructions. A rideshare driver may depend on mobile applications to receive trip requests, navigate unfamiliar locations and communicate with passengers.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            All these activities require dependable access to mobile services. Here are some reasons why mobile connectivity is important for drivers.
          </p>

          {/* In-content Image 1 */}
          <div className="space-y-2">
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
              <Image
                src="/images/female-driver-using-smartphone-in-the-car-2025-03-15-23-52-12-utc 1.png"
                alt="Driver using smartphone GPS navigation inside a car"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
              Navigation, delivery apps and customer messaging all depend on reliable mobile data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-teal-600 shrink-0" /> 1. Navigation and Route Planning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Navigation applications help drivers identify routes, understand traffic conditions and reach destinations more efficiently. Having access to mobile data makes it easier to use digital maps and receive updated route information.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                For drivers who regularly travel through unfamiliar areas, navigation is an essential part of their working routine.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal-600 shrink-0" /> 2. Managing Delivery and Rideshare Applications
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Many independent drivers use digital platforms to receive assignments, manage bookings and communicate with customers.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Applications associated with rideshare and delivery services can become central to daily operations. A suitable mobile plan helps drivers maintain access to these important digital tools.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600 shrink-0" /> 3. Communication with Customers
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Clear communication helps drivers coordinate pickups, confirm delivery instructions and respond to customer enquiries.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Mobile connectivity supports calls, messages and other communication services that help keep these interactions organised.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600 shrink-0" /> 4. Managing Multiple Work Applications
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Some professional drivers use several applications throughout the day, including navigation, delivery platforms, messaging services and business management tools.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                Choosing a mobile plan that matches actual data usage can help drivers manage these activities without paying for features they do not need.
              </p>
            </div>
          </div>
        </section>

        {/* DriverX Mobile: Connectivity Designed Around Drivers */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            DriverX Mobile: Connectivity Designed Around Drivers
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            DriverX Mobile focuses on the connectivity requirements of professional drivers, gig workers, fleet operators and mobile professionals.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Unlike a general mobile service approach, its website highlights solutions designed around the needs of people who depend on mobile technology while working.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            The company supports different driver categories, including rideshare professionals, independent delivery workers and commercial transportation operators. Its driver-focused services are designed to help customers explore connectivity solutions suited to their work requirements.
          </p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400">
              Mobile Solutions for Gig and Delivery Drivers
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Independent drivers often depend on their smartphones to manage work throughout the day. From accepting delivery requests to accessing navigation and coordinating customer interactions, mobile connectivity supports multiple parts of the working process.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              DriverX Mobile provides driver-focused plans for people working across different gig and delivery activities. These solutions are relevant to professionals using platforms such as Uber, Lyft, DoorDash, Amazon Flex and other delivery and transportation services.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Drivers can explore the available options through the official{" "}
              <Link href="/gig-delivery-driver-plans" className={linkClass}>
                DriverX Gig and Delivery Driver Plans
              </Link>{" "}
              page.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400">
              Connectivity Options for Fleet and Logistics Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5 items-center">
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  Businesses operating transportation and logistics fleets have different connectivity requirements from individual drivers. Fleet operators may need mobile services that support communication, location-related tools, connected devices and coordination between drivers and management teams.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  DriverX Mobile also offers fleet and logistics connectivity solutions designed to support commercial transportation operations. Businesses can explore the available services through the{" "}
                  <Link href="/fleet-logistics-connectivity" className={linkClass}>
                    DriverX Fleet and Logistics Connectivity
                  </Link>{" "}
                  page.
                </p>
              </div>
              <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden">
                <Image
                  src="/images/new/A fleet operations manager reviewing a tablet beside a row of delivery vans.png"
                  alt="Fleet operations manager reviewing a tablet beside a row of delivery vans"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400">
              Flexible Mobile Plan Options
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Different drivers have different connectivity requirements. A part-time delivery driver may have different data requirements from someone working full-time in rideshare or managing multiple delivery applications.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              DriverX Mobile provides different plan categories, including{" "}
              <Link href="/prepaid-plans" className={linkClass}>prepaid</Link>,{" "}
              <Link href="/postpaid-plans" className={linkClass}>postpaid</Link>,{" "}
              <Link href="/business-plans" className={linkClass}>business</Link> and{" "}
              <Link href="/data-only-plans" className={linkClass}>data-only</Link> options. Exploring these categories can help customers identify an option that better matches their usage requirements and budget.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Visit the official{" "}
              <Link href="/plans" className={linkClass}>
                DriverX Mobile Plans
              </Link>{" "}
              page to explore available options.
            </p>
          </div>
        </section>

        {/* How the Discount Helps */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            How the 35% Introductory Discount Helps Drivers Save
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Mobile expenses can add up over time, particularly for individuals who use their phones extensively for professional activities. An introductory discount can help reduce the cost of eligible services during the initial months of a mobile plan.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            With DriverX Mobile&apos;s 35% introductory promotion, qualifying customers can benefit from reduced eligible driver-plan charges for three months. Here is an illustrative example of how the discount works:
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-sm sm:text-base bg-white dark:bg-gray-800">
              <thead className="bg-[#0f766e] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Eligible monthly plan charge</th>
                  <th className="text-right px-4 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="px-4 py-3">Original monthly charge</td>
                  <td className="px-4 py-3 text-right">$50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">35% introductory discount</td>
                  <td className="px-4 py-3 text-right">$17.50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Discounted monthly charge</td>
                  <td className="px-4 py-3 text-right">$32.50</td>
                </tr>
                <tr className="bg-teal-50 dark:bg-teal-950/40 font-semibold text-teal-900 dark:text-teal-200">
                  <td className="px-4 py-3">Savings over three months</td>
                  <td className="px-4 py-3 text-right">$52.50</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Illustration only. The $50 plan charge is an example, not a confirmed DriverX Mobile plan price. Actual savings depend on the eligible plan charge and applicable promotional conditions.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            For customers who qualify, the activation-fee waiver may provide additional upfront savings when commercially approved.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Before activating a new line, customers should confirm whether their selected plan qualifies and whether any activation charges or other fees apply.
          </p>
        </section>

        {/* Who Can Benefit */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Who Can Benefit from DriverX Mobile&apos;s Promotional Offer?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            The introductory promotion may be relevant to several types of mobile customers, particularly those who depend on connectivity for their professional activities.
          </p>

          {/* In-content Image 2 */}
          <div className="space-y-2">
            <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
              <Image
                src="/images/close-up-of-bus-driver-using-cell-phone-while-driv-2024-12-13-22-26-40-utc 1.png"
                alt="Commercial driver checking a smartphone from the driver's seat"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
              From rideshare to commercial transport, connectivity keeps every kind of driver on schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Car,
                title: "Rideshare Drivers",
                text: "Rideshare professionals regularly use mobile applications to manage trip requests, navigate routes and communicate with passengers. A suitable mobile plan can help support these everyday activities.",
              },
              {
                icon: ShoppingBag,
                title: "Food Delivery Drivers",
                text: "Food delivery professionals depend on digital platforms to receive orders, check delivery details and coordinate with customers. Mobile connectivity plays an important role in keeping these activities accessible.",
              },
              {
                icon: Briefcase,
                title: "Independent Gig Workers",
                text: "Gig workers often manage multiple responsibilities using their smartphones. Whether accessing work platforms, checking schedules or communicating with customers, a suitable mobile service can support their daily routines.",
              },
              {
                icon: Truck,
                title: "Commercial and Fleet Drivers",
                text: "Transportation businesses need effective communication between drivers, operations teams and fleet managers. DriverX Mobile's fleet-focused solutions provide another option for businesses exploring mobile connectivity for their operations.",
              },
              {
                icon: Plane,
                title: "Frequent Travellers and Mobile Professionals",
                text: "Professionals who spend significant time travelling may benefit from exploring mobile solutions that suit their communication and data requirements. The right plan depends on individual usage, coverage availability and service requirements.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-teal-600 dark:border-teal-500 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon className="w-5 h-5 text-teal-600 shrink-0" /> {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Consider */}
        <section className="bg-teal-50/70 dark:bg-teal-950/30 rounded-2xl p-6 sm:p-8 border border-teal-200 dark:border-teal-900 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-teal-900 dark:text-teal-200">
            What to Consider Before Choosing a Driver Mobile Plan
          </h2>
          <p className="text-sm sm:text-base text-teal-800 dark:text-teal-300">
            Finding an appropriate mobile plan involves more than comparing promotional discounts. Drivers should consider their actual connectivity requirements before selecting a service. Here are some important factors to evaluate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              {
                icon: Wifi,
                title: "Data Allowance",
                text: "Think about how much mobile data you use every month. Navigation, video calls, messaging, streaming and work applications can contribute to overall data consumption. Choosing a plan that matches your typical usage can help avoid unnecessary expenses.",
              },
              {
                icon: MapPin,
                title: "Network Coverage",
                text: "Coverage is particularly important for drivers who travel between cities, suburbs and different working locations. Check the provider's coverage information for the areas where you regularly work and travel.",
              },
              {
                icon: Share2,
                title: "Mobile Hotspot Availability",
                text: "Some drivers use hotspot functionality to connect additional devices. If you need to connect a tablet, laptop or another compatible device, check whether your chosen plan includes hotspot access and what limits apply.",
              },
              {
                icon: RefreshCw,
                title: "Plan Flexibility",
                text: "Your mobile requirements may change depending on working hours, seasonal demand and professional activities. Review available billing arrangements, plan conditions and cancellation policies before making a decision.",
              },
              {
                icon: Headphones,
                title: "Customer Support",
                text: "Accessible customer support can be useful when you experience activation difficulties, billing questions or connectivity issues. Consider the available support channels and service hours when comparing mobile providers.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-teal-100 dark:border-teal-900 shadow-xs space-y-1"
              >
                <span className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-teal-600 shrink-0" /> {title}
                </span>
                <p className="text-gray-600 dark:text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Explore the Offer */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            How to Explore the DriverX Mobile Offer
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Getting started with a new mobile service should involve understanding the available plans and checking the conditions of the promotional offer. Customers interested in the DriverX Mobile introductory promotion can follow these steps:
          </p>
          <ol className="space-y-3">
            {[
              {
                title: "Visit the Official Website",
                body: (
                  <>
                    Start by visiting{" "}
                    <Link href="/" className={linkClass}>
                      www.driverxmobile.com
                    </Link>{" "}
                    to explore the company&apos;s mobile services and available solutions.
                  </>
                ),
              },
              {
                title: "Review Available Mobile Plans",
                body: "Compare the available prepaid, postpaid, business and data-only plans to identify an option that suits your connectivity requirements.",
              },
              {
                title: "Check Promotional Eligibility",
                body: "Confirm whether your selected driver plan qualifies for the 35% introductory discount during the first three months.",
              },
              {
                title: "Confirm Activation Conditions",
                body: "Ask whether your new line qualifies for an activation-fee waiver. This benefit is subject to eligibility and commercial approval.",
              },
              {
                title: "Review the Terms Before Activation",
                body: "Check the applicable charges, promotional period, plan conditions and any additional fees before completing your purchase.",
              },
            ].map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0f766e] text-white font-bold text-sm shrink-0">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Step {i + 1}: {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-gray-700 dark:text-gray-300">
            For further information, customers can contact DriverX Mobile through its official website.
          </p>
        </section>

        {/* Why Choose a Driver-Focused Mobile Solution */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Why Choose a Driver-Focused Mobile Solution?
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Drivers have different connectivity requirements from people who primarily use their phones for personal communication.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            A professional driver may depend on mobile services throughout an entire working day. Even small interruptions to communication or access to essential applications can create inconvenience. A driver-focused mobile solution recognises these practical requirements.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              DriverX Mobile highlights several areas of its service offering:
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {[
                "Connectivity solutions for gig workers and professional drivers.",
                "Mobile services for fleet and logistics operations.",
                "Options for different plan categories and usage requirements.",
                "Driver-focused support and connected services.",
                "Additional services designed to support mobile professionals.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            The company also highlights smart savings features and vehicle-related services as part of its wider driver-focused ecosystem.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            For more information about its approach and services, visit the{" "}
            <Link href="/" className={linkClass}>
              DriverX Mobile official website
            </Link>
            .
          </p>
        </section>

        {/* FAQ Accordion Section */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions (FAQs)
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {faqList.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                  className="w-full flex justify-between items-center text-left font-semibold text-gray-900 dark:text-white hover:text-teal-700 dark:hover:text-teal-400 transition"
                >
                  <span className="text-sm sm:text-base pr-4">
                    {idx + 1}. {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-1">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final Thoughts */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Final Thoughts: Drive Smarter and Make More of Your Mobile Plan
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Reliable mobile connectivity is an important part of modern professional driving. Whether you work in rideshare, delivery, logistics or another mobile profession, having a suitable mobile plan can help you stay connected to the digital tools that support your work.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            DriverX Mobile focuses on providing connectivity solutions for drivers and mobile professionals, with services designed around different working requirements.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Its introductory promotion offers an opportunity for eligible customers to receive 35% off eligible driver-plan charges for the first three months, with a potential activation-fee waiver for qualifying new lines subject to commercial approval.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            If you are exploring a driver-focused mobile solution, take the time to compare available plans, review the promotional conditions and choose an option that suits your needs.
          </p>
          <p className="text-gray-900 dark:text-white font-semibold">
            Drive smarter. Stay connected. Save more with DriverX Mobile.
          </p>
        </section>
      </main>

      {/* CTA Section */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#0f766e] text-white rounded-2xl p-8 sm:p-10 text-center shadow-lg space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">
            Save 35% on Eligible Driver Plans for Three Months
          </h3>
          <p className="text-teal-100 max-w-2xl mx-auto text-sm sm:text-base">
            Explore the official website today and check which DriverX Mobile plans qualify for the introductory offer.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/plans"
              className="bg-white text-teal-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-full text-sm transition shadow-sm"
            >
              Explore DriverX Mobile Plans
            </Link>
            <Link
              href="/gig-delivery-driver-plans"
              className="bg-teal-800 hover:bg-teal-900 text-white border border-teal-600 font-semibold px-6 py-3 rounded-full text-sm transition"
            >
              View Gig Driver Plans
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
