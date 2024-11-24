import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "./ui/button";
import { Author, Startup } from "@/sanity/types";

export type StartupCardType = Omit<Startup, "author"> & {
  author?: Author;
};

interface IProps {
  post: StartupCardType;
}

const StartupCard: FC<IProps> = ({ post }) => {
  return (
    <li className="startup-card group">
      {/* Row 1: Created Date, Views */}
      <div className="flex-between">
        {/* Created Date */}
        <p className="startup_card_date">{formatDate(post._createdAt)}</p>
        {/* Views */}
        <div className="flex gap-1 5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{post.views}</span>
        </div>
      </div>
      {/* Row 2: Author Name, Post Title, Author Avatar */}
      <div className="flex-between mt-5 gap-5">
        {/* Row 2,Left: Author Name, Post Title */}
        <div className="flex-1">
          {/* Author Name (Link) */}
          <Link href={`/user/${post.author?._id}`}>
            <p className="text-16-medium line-clamp-1">{post.author?.name}</p>
          </Link>
          {/* Post Title */}
          <Link href={`/startup/post/${post._id}`}>
            <h3 className="text-26-semibold line-clamp-1">{post.title}</h3>
          </Link>
        </div>
        {/* Row 2,Right: Author Avatar */}
        {/* Author Avatar Image */}
        <Link href={`/user/${post.author?._id}`}>
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
      <Link href={`/startup/${post._id}`}>
        {/* Description */}
        <p className="startup-card_desc">{post.description}</p>
        {/* Image */}
        <img src={post.image} alt="startup" className="startup-card_img" />
      </Link>
      {/* Row 4: Footer */}
      <div className="flex-between gap-3 mt-5">
        {/* Category Link */}
        <Link href={`/?query=${post.category?.toLowerCase()}`}>
          <p className="text-16-medium">{post.category}</p>
        </Link>
        {/* Startup Link */}
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${post._id}`}>Read More</Link>
        </Button>
      </div>
    </li>
  );
};

export default StartupCard;
