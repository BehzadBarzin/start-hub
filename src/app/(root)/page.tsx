import SearchForm from "@/components/SearchForm";

interface IProps {
  searchParams: Promise<{ query?: string }>;
}

export default async function Home({ searchParams }: IProps) {
  // Extract the query string from the search params
  const query = (await searchParams).query;

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
    </>
  );
}
