import { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
  title: "DriverX Mobile | Login to Manage Your Services",
  description:
    "Log in to your DriverX Mobile account now to manage your services, view and pay bills, track your usage & enjoy full control over your mobile plan & features.",
};

export default function Page() {
  return <Login />;
}