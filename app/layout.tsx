import Bottom from "./components/layout/Footer";
import Navbar from "./components/layout/Header";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
export const metadata = {
  title: "DriverX",
  description: "DriverX Mobile - Your Ultimate Driving Companion",
  icons: {
    icon: "/favicon.ico",        // standard favicon
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
            {children}
          <Bottom/>
        </AuthProvider>
      </body>      
    </html>
  );
}