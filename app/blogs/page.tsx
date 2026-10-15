import Image from "next/image";
import Link from "next/link";
import { BLOGS } from "./blogsData";

export const metadata = {
  title: "Guides & Insights | DriverX Mobile",
  description:
    "Practical, plain-language guidance for delivery drivers, fleet managers, and gig workers using DriverX Mobile.",
  alternates: {
    canonical: "https://driverxmobile.com/blogs",
  },
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Header Section */}
      <section className="pt-16 pb-12 px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-teal-700 font-semibold tracking-wider text-xs uppercase mb-3">
          <span className="w-5 h-0.5 text-teal-700"></span>
          <span>BLOG</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#142646] dark:text-white  tracking-tight leading-tight max-w-3xl">
          Guides for drivers, fleets, and mobile connectivity
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
          Practical, plain-language guidance for delivery drivers, fleet managers, and gig workers using DriverX Mobile.
        </p>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {BLOGS.map((blog) => (
            <Link
              key={blog.id}
              href={blog.href}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative w-full aspect-[16/10] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Category */}
                  <span className="text-[11px] font-bold tracking-wider text-teal-700 uppercase">
                    {blog.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-teal-700 dark:group-hover:text-teal-400 transition-colors mt-2 leading-snug">
                    {blog.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Footer Meta & Read Link */}
                <div className="pt-5 mt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {blog.date} · {blog.readTime}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 flex items-center gap-1 transition-colors">
                    Read <span className="text-sm">↗</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}