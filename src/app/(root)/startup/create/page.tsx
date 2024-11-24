import { auth } from "@/auth";
import StartupForm from "@/components/StartupForm";
import { redirect } from "next/navigation";

const Page = async () => {
  // Get the user session from NextAuth
  const session = await auth();

  // If user is not logged in, redirect to login
  if (!session) redirect("/");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Submit Your Startup</h1>
      </section>
      {/* Client Component */}
      <StartupForm />
    </>
  );
};

export default Page;
