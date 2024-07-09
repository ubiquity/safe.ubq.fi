import { getUser } from "@/scripts/supabase/server-side";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  return <p>Hello {user.email}</p>;
}
