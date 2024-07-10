import { getUser } from "@/app/lib/supabase/server-side";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LeftHandProfileBox } from "./components/profile-box";

export default async function Page() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  return (
    <>
      <div className="col-span-3">
        <LeftHandProfileBox usr={user} />
      </div>
    </>
  );
}
