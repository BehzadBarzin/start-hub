import Form from "next/form";
import { FC } from "react";
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";

interface IProps {
  query?: string;
}

const SearchForm: FC<IProps> = ({ query }) => {
  return (
    <Form action="/" scroll={false} className="search-form">
      {/* Main Input */}
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />

      {/* Search & Reset Form Buttons */}
      <div className="flex gap-2">
        {query && <SearchFormReset />}

        {/* Submit/Search Button */}
        <button type="submit" className="search-btn text-white">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
