import React, { ReactElement } from "react";
import { Input, InputGroup } from "@/components/input";
import { Button } from "@/components/button";
import { BadgeButton } from "@/components/badge";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import CollapsibleCodeBlock from "@/components/collapsible-code-block";

export default function SearchSection({
  searchInput,
  setSearchInput,
  handleSearch,
  isSearching,
  showGuide,
  setShowGuide,
  searchQuery,
}: {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (input?: string) => void;
  isSearching: boolean;
  showGuide: boolean;
  setShowGuide: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery?: [];
}): ReactElement {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
      <div className="max-sm:w-full sm:flex-1">
        <div className="mt-4 flex max-w-full gap-4">
          <div className="flex-1">
            <InputGroup>
              <MagnifyingGlassIcon />
              <Input
                name="search"
                type="search"
                placeholder="Search tokens..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
          </div>
          <Button onClick={() => handleSearch()} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        <CollapsibleCodeBlock
          code={JSON.stringify(searchQuery, null, 2)}
          language="json"
        />

        <div className="mt-2">
          <BadgeButton
            color={showGuide ? "orange" : "zinc"}
            onClick={() => setShowGuide(!showGuide)}
          >
            {showGuide ? "Hide Guide" : "Show Guide"}
          </BadgeButton>
        </div>
      </div>
    </div>
  );
}
