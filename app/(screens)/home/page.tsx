import { PasskeyLogin } from "@/components/client/passkey-login";
import { PasskeyCreateButton } from "@/components/client/register-button";

export default async function Home() {
  return (
    <div className="grid grid-cols-2 items-center justify-center h-screen text-white">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Create a Passkey</h1>
        <PasskeyCreateButton text="Create" />
      </div>

      <div className="absolute top-60 left-0 w-full h-16 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-wrap max-w-2xl text-center">
          WebAuthn Account Abstraction<span className="px-2 py-1 font-bold text-sm bg-black opacity-60 rounded-full ">Demo</span>
        </h1>
      </div>

      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Login With Passkey</h1>
        <PasskeyLogin />
      </div>
    </div>
  );
}
