import type { Metadata, Viewport } from "next";
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

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container h-screen py-28">
      <div className="w-full h-full grid grid-cols-12">{children}</div>
    </div>
  );
}
