import React, { FC, useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "../lib/utils";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
  debounceTimeMs?: number;
  debounceAction?: (text: string) => void;
};

const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  className,
  debounceAction,
  debounceTimeMs = 300,
}) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!debounceAction) return;
    const handler = setTimeout(() => {
      debounceAction(searchText);
    }, debounceTimeMs);

    return () => clearTimeout(handler);
  }, [searchText, debounceTimeMs, debounceAction]);

  return (
    <div
      className={cn(
        "border flex items-center gap-2 p-1 bg-white border-green-900 rounded-xl ",
        className
      )}
    >
      <label htmlFor="search">
        <SearchIcon />
      </label>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder || "Start typing..."}
        id="search"
        name="search"
        className="p-0 !border-transparent !bg-transparent !outline-transparent focus:!border-transparent focus:!outline-transparent w-full"
      />
    </div>
  );
};

export default SearchInput;
