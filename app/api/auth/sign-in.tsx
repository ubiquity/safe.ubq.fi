import { getSupabase } from "@/app/lib/supabase/server-side";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn() {
  "use server";

  const origin = headers().get("origin");

  const supabase = await getSupabase();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/api/auth/callback/`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    return redirect("/account?message=Could not authenticate user");
  }

  return redirect("/account");
}
