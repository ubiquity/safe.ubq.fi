import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GridBackground } from "@/components/grid";
import { NavBar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { signIn } from "./api/auth/sign-in";
import { signOut } from "./api/auth/sign-out";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar signIn={signIn} signOut={signOut} />
        <GridBackground>
          <div className="fixed w-full">{children}</div>
        </GridBackground>
        <Toaster />
      </body>
    </html>
  );
}
