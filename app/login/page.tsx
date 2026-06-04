import { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "DriverX Mobile Login | Secure Driver Account Access",
  description:
    "Log in to DriverX Mobile to securely access your driver account, manage trips, view updates, and use the driver dashboard and tools anytime."

};

export default function Page() {
  return <Login />;
}