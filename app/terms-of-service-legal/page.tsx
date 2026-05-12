import Terms from "./Terms";

export const metadata = {
  title: "Terms of Service & Legal Policy | DriverX Mobile",
  description:
    "Read DriverX Mobile’s Terms of Service and legal policies to understand your rights, responsibilities, and how we protect your mobile experience.",
};

export default function TermsPage() {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <Terms />
    </div>
  );
}