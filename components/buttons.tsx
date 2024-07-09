"use client";
import { Button } from "./ui/button";

async function RegisterButton({ className, children }: { className: string; children: React.ReactNode }) {
  return <Button className={className}>{children}</Button>;
}
async function LoginButton({ className, children }: { className: string; children: React.ReactNode }) {
  return <Button className={className}>{children}</Button>;
}

export { RegisterButton, LoginButton };
