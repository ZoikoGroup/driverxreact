import Pci from "./PCI";

export const metadata = {
  title: "PCI DSS Payments Compliance | DriverX Mobile",
  description:
    "DriverX Mobile offers PCI DSS-compliant payment processing to protect your business and customers from fraud by securing sensitive cardholder data.",
};

export default function PCIPaymentPage() {
  return (
    <>
      <Pci />
    </>
  );
}