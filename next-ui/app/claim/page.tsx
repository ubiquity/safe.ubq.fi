import ClaimsPortal from "@/components/claims-portal";

export default async function Page(params: { searchParams: { claim: string } }) {
  return <ClaimsPortal permits={params.searchParams.claim} />;
}
