import PartnerProgram from "../partner-offer-program/PartnerProgram";
import PartnerWithDriverX from "./Partnerpagee";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Partner with DriverX | Enhance Your Offerings",
  description:
    "Partner with DriverX Mobile to boost your service capabilities, expand your market reach, and leverage innovative mobile and fleet connectivity solutions."
};

export default function plans(){

    return(
        <>
        <PartnerWithDriverX/>
        </>
    );
}