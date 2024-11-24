import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

interface IProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home({ searchParams }: IProps) {
  // Extract the query string from the search params
  const query = (await searchParams).query;

  const sanityParams = { search: query || null };

  // Get the posts from Sanity
  const { data: posts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params: sanityParams,
  });

  return (
    <>
      {/* Heading------------------------------------------------------------------------------  */}
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs.
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        {/* Search Form */}
        <SearchForm query={query} />
      </section>
      {/* Startups Grid------------------------------------------------------------------------- */}
      <section className="section_container">
        {/* Title */}
        <p className="text-30-semibold">
          {query ? `Search results for: "${query}"` : "Startups"}
        </p>
        {/* Grid */}
        <ul className="mt-7 card_grid">
          {/* Map over the posts */}
          {posts.length ? (
            // If posts exist, display them
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post._id} post={post} />
            ))
          ) : (
            // If no posts, display a message
            <p className="no-results">No Startups Found!</p>
          )}
        </ul>
      </section>
      {/* Sanity Live--------------------------------------------------------------------------- */}
      {/* Enables content to be updated in real-time if the document is edited */}
      <SanityLive />
      {/* -------------------------------------------------------------------------------------- */}
    </>
  );
}
