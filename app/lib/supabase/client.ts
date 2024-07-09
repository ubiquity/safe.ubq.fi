import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    // @ts-expect-error - process,env is provided by Next.js
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // @ts-expect-error - process,env is provided by Next.js
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
