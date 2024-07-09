import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signOut() {
  "use server";

  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return redirect("/account?message=Could not sign out user");
  }

  return redirect(`/`);
}
