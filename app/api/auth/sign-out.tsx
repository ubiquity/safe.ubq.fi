import { createClient } from "@/app/lib/supabase/server-side";
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
