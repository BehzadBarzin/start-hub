import { defineQuery } from "next-sanity";

// -------------------------------------------------------------------------------------------------
// Sanity Queries
// -------------------------------------------------------------------------------------------------
// Get all startups with author (accepts search param for filtering)
export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || title match $search || category match $search || author->name match $search] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

// -------------------------------------------------------------------------------------------------
// Get a single startup
export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image,
  pitch,
}`);

// -------------------------------------------------------------------------------------------------
// Get the number of views for a startup
export const STARTUP_VIEWS_QUERY = defineQuery(`
  *[_type == "startup" && _id == $id][0]{
      _id, views
  }
`);

// -------------------------------------------------------------------------------------------------
// Find Author by GitHub id
export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
  *[_type == "author" && id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
  `);

// -------------------------------------------------------------------------------------------------
// Get Author by id
export const AUTHOR_BY_ID_QUERY = defineQuery(`
  *[_type == "author" && _id == $id][0]{
      _id,
      id,
      name,
      username,
      email,
      image,
      bio
  }
  `);

// -------------------------------------------------------------------------------------------------
// Get all Startups of an Author
export const STARTUPS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "startup" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

// -------------------------------------------------------------------------------------------------
