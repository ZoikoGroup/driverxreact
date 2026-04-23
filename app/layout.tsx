import Bottom from "./components/layout/Footer";
import Navbar from "./components/layout/Header";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import Script from "next/script";
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Script id="facebook-sdk" strategy="afterInteractive">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '{your-app-id}',
                cookie     : true,
                xfbml      : true,
                version    : '{api-version}'
              });
                
              FB.AppEvents.logPageView();   
                
            };

            (function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) {return;}
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
      </head>
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