import { auth, signOut, signIn } from "@/auth";
import { BadgePlus, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

async function Navbar() {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={133} height={44} />
        </Link>
        {/*  */}
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            // -----------------------------------------------------------------------------------
            // If user is logged in
            // -----------------------------------------------------------------------------------
            <>
              {/* Create Startup Link */}
              <Link href="/startup/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>
              {/* Logout button */}
              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit">
                  <span className="max-sm:hidden">Logout</span>
                  <LogOut className="size-6 sm:hidden text-red-500" />
                </button>
              </form>
              {/* User Profile link */}
              <Link href={`/user/${session?.user?.id}`}>
                <Avatar className="size-10">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            // -----------------------------------------------------------------------------------
            // If user not logged in:
            // -----------------------------------------------------------------------------------
            // Sign In button with github
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button type="submit">Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
