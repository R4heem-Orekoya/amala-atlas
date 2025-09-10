import { SignIn } from "@clerk/nextjs";

export default function Page() {
   return <main className="min-h-[calc(100vh-64px)] max-h-screen max-w-screen grid place-items-center">
      <SignIn />
   </main>;
}
