import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";

interface IProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home({ searchParams }: IProps) {
  // Extract the query string from the search params
  const query = (await searchParams).query;

  const posts = [
    {
      _id: 1,
      _createdAt: new Date(),
      views: 55,
      author: { _id: 1, name: "John Doe" },
      description: "this is a description.",
      image:
        "https://images.unsplash.com/photo-1721332153521-120cb0cd02d9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Robots",
      title: "We Robots",
    },
  ];

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
            posts.map((post) => <StartupCard key={post._id} post={post} />)
          ) : (
            // If no posts, display a message
            <p className="no-results">No Startups Found!</p>
          )}
        </ul>
      </section>
      {/* -------------------------------------------------------------------------------------- */}
    </>
  );
}
