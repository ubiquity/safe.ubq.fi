import { getUser } from "@/app/lib/supabase/server-side";
import { redirect } from "next/navigation";
import { LeftHandProfileBox } from "./components/profile-box";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Account } from "./components/account";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  return <Account user={user} />;
}
