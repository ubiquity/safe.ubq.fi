import { getSupabase } from "@/app/lib/supabase/server-side";
import { redirect } from "next/navigation";

export async function signOut() {
  "use server";

  const supabase = await getSupabase();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return redirect("/account?message=Could not sign out user");
  }

  return redirect(`/`);
}
