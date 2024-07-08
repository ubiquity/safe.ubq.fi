import { createClient } from "@/utils/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Icon } from "./icons";

// Secure Context
export default async function UserAvatar() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return (
      <Avatar>
        <Icon name="logoIcon" className="opacity-50" />
      </Avatar>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={data.user.user_metadata.avatar_url} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
