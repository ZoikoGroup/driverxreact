// app/components/request-form/page.tsx
import RequestForm from "./form";

type Props = {
  /** The request type you want to send – e.g. "support", "account", "demo" */
  requestType?: string;
};

export default function Page({ requestType = "support" }: Props) {
  return (
    <div className="p-4">
      {/*  👇  Pass the type down – you can import this page elsewhere
            and give it a different value, e.g. <Page requestType="account" /> */}
      <RequestForm requestType={requestType} />
    </div>
  );
}
