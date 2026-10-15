import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Blog1 from "../Blog1";
import Blog2 from "../Blog2";
import Blog3 from "../Blog3";
import Blog4 from "../Blog4";
import { BLOGS } from "../blogsData";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = BLOGS.find((b) => b.slug === slug || b.id === slug);

  if (!blog) {
    return {
      title: "Blog Not Found | DriverX Mobile",
    };
  }

  return {
    title: `${blog.title} | DriverX Mobile`,
    description: blog.metaDescription,
    alternates: {
      canonical: `https://driverxmobile.com/blogs/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.metaDescription,
      images: [
        {
          url: blog.image.startsWith("http")
            ? blog.image
            : `https://driverxmobile.com${blog.image}`,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = BLOGS.find((b) => b.slug === slug || b.id === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f7f9f7] dark:bg-gray-900">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-[#0b544e] text-white py-2.5 px-4 sm:px-6 border-b border-teal-800/40">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/blogs"
            className="text-teal-200 hover:text-white font-semibold inline-flex items-center gap-1.5 transition"
          >
            <span>←</span> Back to All Guides
          </Link>
          <span className="text-teal-300/80 uppercase tracking-wider text-[11px] font-medium hidden sm:inline">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Render the matching blog component */}
      {blog.id === "1" && <Blog1 />}
      {blog.id === "2" && <Blog2 />}
      {blog.id === "3" && <Blog3 />}
      {blog.id === "4" && <Blog4 />}
    </div>
  );
}
