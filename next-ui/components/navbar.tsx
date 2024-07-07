import Link from "next/link";

import { buttonVariants } from "../components/ui/button";
import Image from "next/image";
import { Icon } from "./icons";

export function TopNavBar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 bg-transparent md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icon.svg" alt="Ubiquity DAO" width={50} height={50} className="rounded-full" />
            <span className="font-bold sm:inline-block text-2xl"></span>
          </Link>

          <nav className="hidden gap-6 md:flex"></nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href={"https://github.com/ubiquity"} target="_blank" rel="noreferrer">
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                <Icon name="github" className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
