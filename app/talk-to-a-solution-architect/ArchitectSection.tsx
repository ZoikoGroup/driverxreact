"use client";
import React from "react";
import { Lightbulb, Map, User } from "lucide-react";
import RequestForm from "../components/request-form/form";
      import Image from "next/image";

export default function ArchitectSection() {
  const tableData = [
    {
      title: "Provisioning Infrastructure",
      desc: "APIs for activation, lifecycle control, metadata tagging",
    },
    {
      title: "eSIM/pSIM Lifecycle Management",
      desc: "Intelligent distribution, over-the-air swaps, remote control",
    },
    {
      title: "Usage Optimization",
      desc: "Data tiering, pooled plans, anomaly detection rules",
    },
    {
      title: "Multi-Network Resilience",
      desc: "Routing failover, cross-network fallback, zero-downtime configs",
    },
    {
      title: "Platform Integration",
      desc: "Native telecom flows inside logistics, mobility, SaaS, or IoT platforms",
    },
    {
      title: "Compliance & Security",
      desc: "KYC rules, network zoning, SIM encryption, regional compliance frameworks",
    },
  ];

  const audience = [
    "CTOs and Heads of Engineering",
    "Platform Integration Leads",
    "IoT Product Managers and OEM Builders",
    "Logistics & Mobility Founders",
    "Enterprise Procurement & Operations Executives",
  ];
const expectations = [
  {
    icon: "/images/head.png",
    text: "1:1 consultation with a DriverX Solutions Architect",
  },
  {
    icon: "/images/Vector (8).png",
    text: "Recommendations specific to your industry, use case, and tech stack",
  },
  {
    icon: "/images/Vector (14).png",
    text: "Diagrams, benchmarks, and follow-up materials as needed",
  },
];  

  return (
    <>
    <div className="bg-gray-100 dark:bg-gray-950 py-12 px-4 md:px-10 rounded-2xl">
        <div className="bg-[#1e5d57] py-6 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-bold  dark:text-white">
      Talk to a Solution Architect
        </h1>
      </div>
      <br />
      
      {/* TOP TEXT */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-teal-600 font-semibold text-lg mb-2">
          Let’s Engineer What Moves You
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          
Your business isn’t off-the-shelf. Your connectivity shouldn’t be either. Whether you're managing high-volume SIM deployment, embedding eSIMs into hardware, building IoT infrastructure, or integrating telecom into your platform — we’ll work with you to architect a solution that scales intelligently.
        </p>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
          What Our Architects Deliver
        </h3>

        <div className="grid grid-cols-2 text-sm font-medium text-gray-500 border-b pb-2 mb-2">
          <p>Advisory Focus</p>
          <p>What We Help You Build</p>
        </div>

        {tableData.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-2 py-3 border-b border-gray-100 dark:border-gray-800"
          >
            <p className="text-teal-600 font-medium">{item.title}</p>
            <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* AUDIENCE */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
          Who Should Schedule a Session?
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {audience.map((item, i) => (
            <div
              key={i}
              className="bg-yellow-50 dark:bg-gray-800 border-l-4  dark : hover:bg-yellow-800  border-yellow-400 rounded-md px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* EXPECTATIONS */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-6 text-gray-800 dark:text-white">
          What to Expect
        </h3>



<div className="grid md:grid-cols-3 gap-5">
  {expectations.map((item, i) => (
    <div
      key={i}
      className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center flex flex-col items-center gap-3"
    >
      <Image
        src={item.icon}
        alt="icon"
        width={40}
        height={40}
        className="object-contain"
      />

      <p className="text-xl  text-teal-600">
        {item.text}
      </p>
    </div>
  ))}
</div>
      </div>
         
    </div>
      <RequestForm requestType="Solution Architect" />
      </>
  );
}