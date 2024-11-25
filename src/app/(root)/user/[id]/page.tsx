import { auth } from "@/auth";
import { sanityFetch } from "@/sanity/lib/live";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { AUTHOR_BY_ID_QUERYResult } from "@/sanity/types";
import { notFound } from "next/navigation";
import { FC, Suspense } from "react";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import StartupCardSkeleton from "@/components/StartupCardSkeleton";

// Enable experimental feature: PPR (Partial Pre-Rendering)
export const experimental_ppr = true;

interface IProps {
  params: Promise<{ id: string }>; // Provided by Next.js dynamic route (/startup/[id]/page.tsx)
}

const UserDetails: FC<IProps> = async ({ params }) => {
  // Get the user id from dynamic route
  const id = (await params).id;

  // Get user from Sanity
  const { data } = await sanityFetch({
    query: AUTHOR_BY_ID_QUERY,
    params: { id },
  });
  const user = data as AUTHOR_BY_ID_QUERYResult;

  // If user is not found, redirect to 404 page
  if (!user) {
    return notFound();
  }

  const session = await auth();

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image || ""}
            alt={user.name || ""}
            width={220}
            height={220}
            className="profile_image"
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Your" : "All"} Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  );
};

export default UserDetails;
