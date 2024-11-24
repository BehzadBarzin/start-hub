/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

// -------------------------------------------------------------------------------------------------
// Server Action: Create Pitch
export const createPitch = async (
  state: any,
  formData: FormData,
  pitch: string
) => {
  // Get the user session (from NextAuth)
  const session = await auth();

  // If user is not logged in, return error
  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  // Get the form data into variables
  const { title, description, category, link } = Object.fromEntries(
    Array.from(formData).filter(([key]) => key !== "pitch")
  );

  // Slugify the title
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    // Create the startup
    const startup = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };

    // Create the startup in the Sanity database
    const result = await writeClient.create({ _type: "startup", ...startup });

    // Return the success result to the client
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    // If an error occurs, log it
    console.log(error);
    // Return the error to the client
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
