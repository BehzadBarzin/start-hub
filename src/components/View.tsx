import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { STARTUP_VIEWS_QUERYResult } from "@/sanity/types";
import Ping from "./Ping";
import { FC } from "react";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

interface IProps {
  id: string;
}

const View: FC<IProps> = async ({ id }) => {
  // Get total views per startup from Sanity
  const data: STARTUP_VIEWS_QUERYResult = await client
    .withConfig({ useCdn: false }) // To always fetch the latest (don't use cache)
    .fetch(STARTUP_VIEWS_QUERY, { id });
  const totalViews: number = data?.views || 0;

  // Update views
  // Using `unstable_after` to schedule work to be done after the current request
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};
export default View;
