 function Leadership() {
  const leaders = [
    {
     
      img: "/images/Group 1597883024.png",
      bio: "A visionary leader with over 30 years of executive experience across global business strategy, telecommunications, fintech, and enterprise governance. Lennox holds an MSc in Accounting, an LLB (Hons), and two international professional accountancy qualifications. As Founder and Executive Chairman of DriverX Mobile and the wider Zoiko Communications Group, he brings unmatched foresight, financial rigor, and purpose-driven innovation to every venture. Lennox’s leadership philosophy fuses economic empowerment with practical connectivity - enabling DriverX to deliver transformative services to America’s mobility workforce."
    },
    {

      img: "/images/Group 1597883024 (1).png",
      bio: "A telecom industry veteran with over 20 years of experience in wireless network expansion, digital platform growth, and customer innovation. Sophia previously led enterprise strategy at a leading Tier-1 carrier and brings proven expertise in scaling purpose-built platforms. Her vision for DriverX focuses on unlocking value across the gig and logistics mobility sectors, ensuring operational agility and strategic resilience."
    },
    {
   
      img: "/images/Group 1597883024 (2).png",
      bio: "With a PhD in Computer Engineering and more than 25 years of experience in IoT, telematics, and cloud-native infrastructure, Dr. Suresh leads DriverX’s engineering and product innovation. He architected the company’s SIM provisioning engine, telematics stack, and mobility integration APIs, making DriverX a pioneer in intelligent fleet connectivity."
    },
    {
      
      img: "/images/Group 1597883027.png",
      bio: "A commercially astute leader with a track record in enterprise sales, B2B growth, and telecom market development. Junior has been instrumental in scaling MVNO offerings across the U.S. and Europe, forging strong partnerships with OEMs, logistics platforms, and fintech providers. He leads DriverX’s revenue strategy, alliances, and go-to-market execution."
    },
    {
     
      img: "/images/Group 1597883024 (3).png",
      bio: "An award-winning customer experience executive with nearly two decades in CX design, bilingual support, and service operations across telecom and digital finance. Luis ensures every DriverX customer touchpoint - from onboarding to support to loyalty - reflects the company’s commitment to driver-first service and long-term value."
    }
  ];

  return (
    <section className="bg-[#f8faf7] py-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Leadership Team</h1>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
           At DriverX Mobile, leadership is not just about operational excellence - it's about purpose, people, and progress. Our executive team brings deep expertise across telecommunications, technology, logistics, customer operations, and commercial strategy. Together, we’re building a next-generation mobile platform that empowers 
the people who move America.
          </p>
        </div>

        <h1 className="text-center text-4xl font-semibold tracking-widest text-green-700 mb-10">
  EXECUTIVE LEADERSHIP
</h1>

        {/* Leader Cards */}
        <div className="space-y-14">
          {leaders.map((leader, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <img
                src={leader.img}
                alt={leader.name}
                className="w-52 h-60 object-cover rounded-md shadow-md"
              />

              {/* Text */}
              <div className="flex-1">
              
                <p className="text-gray-600 leading-relaxed">{leader.bio}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Leadership;