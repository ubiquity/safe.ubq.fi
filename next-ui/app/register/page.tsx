/**
 * Register page:
 * - Create a new user account
 * - Register a new passkey
 * - Have EOA created
 * - Have Safe deployed
 */
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <p>Hello {data.user.email}</p>;
}
