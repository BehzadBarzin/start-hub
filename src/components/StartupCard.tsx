import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "./ui/button";
import { STARTUPS_QUERYResult } from "@/sanity/types";

interface IProps {
  startup: STARTUPS_QUERYResult[0]; // Infer the type from the array (type = type of each array element)
}

const StartupCard: FC<IProps> = ({ startup }) => {
  return (
    <li className="startup-card group">
      {/* Row 1: Created Date, Views */}
      <div className="flex-between">
        {/* Created Date */}
        <p className="startup_card_date">{formatDate(startup._createdAt)}</p>
        {/* Views */}
        <div className="flex gap-1 5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{startup.views}</span>
        </div>
      </div>
      {/* Row 2: Author Name, Post Title, Author Avatar */}
      <div className="flex-between mt-5 gap-5">
        {/* Row 2,Left: Author Name, Post Title */}
        <div className="flex-1">
          {/* Author Name (Link) */}
          <Link href={`/user/${startup.author?._id}`}>
            <p className="text-16-medium line-clamp-1">
              {startup.author?.name}
            </p>
          </Link>
          {/* Post Title */}
          <Link href={`/startup/${startup._id}`}>
            <h3 className="text-26-semibold line-clamp-1">{startup.title}</h3>
          </Link>
        </div>
        {/* Row 2,Right: Author Avatar */}
        {/* Author Avatar Image */}
        <Link href={`/user/${startup.author?._id}`}>
          <Image
            src={"https://placehold.co/48x48"}
            alt="author"
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>
      {/* Row 3: Startup Description and Image */}
      <Link href={`/startup/${startup._id}`}>
        {/* Description */}
        <p className="startup-card_desc">{startup.description}</p>
        {/* Image */}
        {startup.image && (
          <img src={startup.image} alt="startup" className="startup-card_img" />
        )}
      </Link>
      {/* Row 4: Footer */}
      <div className="flex-between gap-3 mt-5">
        {/* Category Link */}
        <Link href={`/?query=${startup.category?.toLowerCase()}`}>
          <p className="text-16-medium">{startup.category}</p>
        </Link>
        {/* Startup Link */}
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${startup._id}`}>Read More</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartupCard;
