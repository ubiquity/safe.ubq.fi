import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./avatar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SubmitButton } from "@/app/login/submit-button";

export default function SideMenu({ loggedIn, signIn, signOut }: { loggedIn: boolean; signIn: () => Promise<never>; signOut: () => Promise<never> }) {
  const menuItems = [
    {
      label: "Account",
      children: loggedIn
        ? [
            { label: "Profile", href: "/profile" },
            { label: "Logout", href: "/auth/?action=sign-out", action: signOut },
          ]
        : [{ label: "Login", href: "/auth/?action=sign-in", action: signIn }],
    },
    {
      label: "Navigation",
      children: [
        { label: "Home", href: "/" },
        { label: "Claims", href: "/claim" },
        { label: "Account", href: "/register" },
      ],
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="items-center bg-[#333] text-white">
        {menuItems.map((item) => (
          <>
            {item.children.length && (
              <>
                <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
                <DropdownMenuSeparator className="border-t border-[#555]" />
              </>
            )}
            {item.children.map((child) => (
              <>
                {child.action ? (
                  <form className="">
                    {loggedIn ? (
                      <SubmitButton
                        formAction={signOut}
                        className="w-full align-middle items-center flex gap-1 cursor-pointer hover:bg-[#444]  hover:text-white text-[#999]"
                        pendingText="Signing Up..."
                      >
                        <ChevronRight className="w-6 h-6 " />
                        <DropdownMenuItem className="flex items-center gap-2">Sign Out</DropdownMenuItem>
                      </SubmitButton>
                    ) : (
                      <SubmitButton
                        formAction={signIn}
                        className="w-full align-middle items-center flex gap-1 cursor-pointer hover:bg-[#444]  hover:text-white text-[#999]"
                        pendingText="Signing In..."
                      >
                        <ChevronRight className="w-6 h-6 " />
                        <DropdownMenuItem className="flex items-center gap-2">Sign In</DropdownMenuItem>
                      </SubmitButton>
                    )}
                  </form>
                ) : (
                  <Link
                    href={child.href}
                    key={child.label}
                    className="w-full align-middle items-center flex gap-1 cursor-pointer hover:bg-[#444]  hover:text-white text-[#999]"
                  >
                    <ChevronRight className="w-6 h-6 " />
                    <DropdownMenuItem className="flex items-center gap-2">{child.label}</DropdownMenuItem>
                  </Link>
                )}
              </>
            ))}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
