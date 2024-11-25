import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard from "@/components/StartupCard";
import { sanityFetch } from "@/sanity/lib/live";
import { FC } from "react";
import { STARTUPS_BY_AUTHOR_QUERYResult } from "@/sanity/types";

interface IProps {
  id: string;
}

const UserStartups: FC<IProps> = async ({ id }) => {
  // Get author's startups from Sanity
  const { data } = await sanityFetch({
    query: STARTUPS_BY_AUTHOR_QUERY,
    params: { id },
  });
  const startups = data as STARTUPS_BY_AUTHOR_QUERYResult;

  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup) => (
          <StartupCard key={startup._id} startup={startup} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;
