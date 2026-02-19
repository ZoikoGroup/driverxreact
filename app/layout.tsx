import Bottom from "./components/N/Bottom";
import Navbar from "./components/N/Navbar";
import "./globals.css";

export const metadata = {
  title: "DriverX",
  description: "DriverX frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
              <Bottom/>
      </body>


      
    </html>
  );
}