import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { STARTUP_VIEWS_QUERYResult } from "@/sanity/types";
import Ping from "./Ping";
import { FC } from "react";

interface IProps {
  id: string;
}

const View: FC<IProps> = async ({ id }) => {
  // Get total views per startup from Sanity
  const data: STARTUP_VIEWS_QUERYResult = await client
    .withConfig({ useCdn: false }) // To always fetch the latest
    .fetch(STARTUP_VIEWS_QUERY, { id });
  const totalViews: number = data?.views || 0;

  // Todo: Update views

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
