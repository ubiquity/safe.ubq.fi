import { getUser } from "@/app/lib/supabase/server-side";
import { redirect } from "next/navigation";
import { Account } from "./components/account";
import { getSignerData } from "@/app/lib/eoa/get-signer";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <Account
      user={user}
      signer={
        await getSignerData("amoy")
        //   {
        //   address: "0x1234567890",
        //   gnosisNativeBalance: "0.0",
        //   ethNativeBalance: "0.0",
        //   wxdaiBalance: "0.0",
        //   daiBalance: "0.0",
        // }
      }
    />
  );
}
