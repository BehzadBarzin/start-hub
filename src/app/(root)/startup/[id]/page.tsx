import { formatDate } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import {
  PLAYLIST_BY_SLUG_QUERYResult,
  STARTUP_BY_ID_QUERYResult,
} from "@/sanity/types";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard from "@/components/StartupCard";

// Enable experimental feature: PPR (Partial Pre-Rendering)
export const experimental_ppr = true;

// Used to parse markdown
const md = markdownit();

interface IProps {
  params: Promise<{ id: string }>; // Provided by Next.js dynamic route (/startup/[id]/page.tsx)
}

const StartupDetails: FC<IProps> = async ({ params }) => {
  // Get the startup id from dynamic route
  const id = (await params).id;

  // Get startup from Sanity
  const { data } = await sanityFetch({
    query: STARTUP_BY_ID_QUERY,
    params: { id },
  });
  const startup = data as STARTUP_BY_ID_QUERYResult;

  // If startup is not found, redirect to 404 page
  if (!startup) {
    return notFound();
  }

  // Parse markdown content
  const parsedPitch = md.render(startup.pitch || "");

  // Get Featured Startups
  const featuredRes = await sanityFetch({
    query: PLAYLIST_BY_SLUG_QUERY,
    params: { slug: "featured" },
  });
  const featured = (featuredRes.data as PLAYLIST_BY_SLUG_QUERYResult)?.select;

  return (
    <>
      {/* Header */}
      <section className="pink_container !min-h-[230px]">
        {/* Created Date */}
        <p className="tag">{formatDate(startup._createdAt)}</p>
        {/* Title */}
        <h1 className="heading">{startup.title}</h1>
        {/* Description */}
        <p className="sub-heading !max-w-5xl">{startup.description}</p>
      </section>
      <section className="section_container">
        {/* Image */}
        {startup.image && (
          <img
            src={startup.image}
            alt="Startup Image"
            className="w-full h-auto rounded-xl"
          />
        )}
        {/* Content */}
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          {/* Author + Category */}
          <div className="flex-between gap-5">
            {/* Author Link */}
            <Link
              href={`/user/${startup.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              {/* Author Image */}
              <Image
                src={startup.author?.image || ""}
                alt="Author"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              {/* Author Name and Username */}
              <div>
                <p className="text-20-medium">{startup.author?.name}</p>
                <p className="text-20-medium !text-black-300">
                  @{startup.author?.username}
                </p>
              </div>
            </Link>
            {/* Category */}
            <p className="category-tag">{startup.category}</p>
          </div>
          {/* Pitch Details */}
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedPitch ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedPitch }} // To tell React not to escape HTML, and render it
            />
          ) : (
            <p className="no-result">No Pitch Provided</p>
          )}
        </div>
        {/* Line */}
        <hr className="divider" />
        {/* Editor Selected Startups (Featured) */}
        {featured?.length && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {featured.map((startup) => (
                <StartupCard key={startup._id} startup={startup} />
              ))}
            </ul>
          </div>
        )}
        {/* Dynamic Part of the component (PPR) */}
        {/* Views Count */}
        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={startup._id} />
        </Suspense>
      </section>
    </>
  );
};

export default StartupDetails;
