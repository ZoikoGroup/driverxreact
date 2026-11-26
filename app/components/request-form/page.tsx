// app/components/request-form/page.tsx
import RequestForm from "./form";

// Next.js route components only accept `params` / `searchParams`. The old `requestType` prop made
// `next build` fail its type check, so the type now comes from the query string
// (?requestType=demo) and defaults to "support" as before. The URL itself is unchanged.
type Props = {
  searchParams?: Promise<{ requestType?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const requestType = (await searchParams)?.requestType ?? "support";
  return (
    <div className="p-4">
      <RequestForm requestType={requestType} />
    </div>
  );
}
