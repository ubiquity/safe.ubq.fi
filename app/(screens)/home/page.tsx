import { SubmitButton } from "@/components/client/submit-button";

export default async function Home() {
  return (
    <div className="grid grid-cols-2 items-center justify-center h-screen text-white">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Create a Passkey</h1>
        <p className="text-sm text-gray-400">*Automated with OAuth or enter details below</p>
        <form className="flex flex-col gap-1 items-center justify-center mt-2 w-96">
          <input type="text" placeholder="(Optional) display name" className="border bg-[#333] border-gray-400 p-2 rounded w-80 " />
          <input type="text" placeholder="(Optional) email/name" className="border bg-[#333] border-gray-400 p-2 rounded w-80" />
          <SubmitButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded left-0">Register</SubmitButton>
        </form>
      </div>

      <div className="absolute top-60 left-0 w-full h-16 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-wrap max-w-2xl text-center">WebAuthn Account Abstraction<span
        className="px-2 py-1 font-bold text-sm bg-black opacity-60 rounded-full ">Demo</span></h1>
        </div>

      <div className="container mx-auto flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Login With Passkey</h1>
        <p className="text-sm text-gray-400">*Choose via autofill or manual selection</p>
        <input autoComplete="webauthn" type="text" placeholder="(Optional) display name" className="border mt-2 bg-[#333] border-gray-400 p-2 rounded w-80 " />
        <SubmitButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-1 px-4 rounded left-0">Login</SubmitButton>
      </div>
    </div>
  );
}
