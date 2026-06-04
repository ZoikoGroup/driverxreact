import EnterpriseSection from "./EnterpriseSection";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "DConnect with DriverX Mobile Enterprise Sales Team",
  description:
    "Connect with DriverX Mobile’s Enterprise Sales team to explore tailored wireless and IoT solutions that boost fleet management, logistics, and EV services."

};

export default function plans(){

    

    return(
        <>
        <EnterpriseSection/>
        
        </>
    );
}