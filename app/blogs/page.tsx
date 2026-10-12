import Blog1 from "./Blog1";
import Blog2 from "./Blog2";
import Blog3 from "./Blog3";
import Blog4 from "./Blog4";

export const metadata = {
  title: "Blogs & Insights | DriverX Mobile",
  description:
    "Explore the latest insights on mobile connectivity, eSIM advantages, infrastructure, and delivery driver phone plans from DriverX Mobile.",
  alternates: {
    canonical: "https://driverxmobile.com/blogs",
  },
};

export default function page() {
  return (
    <div>
      <Blog1 />
      <Blog2 />
      <Blog3 />
      <Blog4 />
    </div>
  );
}