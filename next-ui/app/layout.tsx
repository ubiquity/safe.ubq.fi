import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GridBackground } from "@/components/grid";
import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const UBIQUITY_REWARDS = "Ubiquity Rewards";

export const metadata: Metadata = {
  title: "Ubiquity Rewards | Ubiquity DAO",
  description: UBIQUITY_REWARDS,
  robots: "index,follow",
  twitter: {
    card: "summary_large_image",
    creator: "@UbiquityDAO",
    description: UBIQUITY_REWARDS,
    title: UBIQUITY_REWARDS,
  },
  openGraph: {
    description: UBIQUITY_REWARDS,
    siteName: UBIQUITY_REWARDS,
    title: UBIQUITY_REWARDS,
    type: "website",
    url: "https://pay.ubq.fi/",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const signIn = async () => {
  "use server";

  const origin = headers().get("origin");

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback/`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  if (error) {
    return redirect("/login?message=Could not authenticate user");
  }

  return redirect("/account");
};

const signOut = async () => {
  "use server";

  const origin = headers().get("origin");
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return redirect("/login?message=Could not sign out user");
  }

  return redirect(`/${origin}`);
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GridBackground>
          <NavBar signIn={signIn} signOut={signOut} />
          {children}
        </GridBackground>
        <Toaster />
      </body>
    </html>
  );
}
