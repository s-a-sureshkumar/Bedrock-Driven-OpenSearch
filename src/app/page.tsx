// collections/Collections.tsx
"use client";
import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { Heading } from "@/components/heading";
import { useAuth } from "@/contexts/auth-context";
import { useListCollections } from "@/hooks/use-list-collections";
import { useGetTotalTokenCount } from "@/hooks/use-get-total-token-count";
import countTotalTokensInSeedData from "@/util/count-total-tokens-in-seed-data";
import Loading from "@/components/loading";
import EmptyCollectionView from "@/components/empty-collection-view";
import SearchSection from "@/components/search-section";
import GuideSection from "@/components/guide-section";
import SearchResults from "@/components/search-results";
import { useSearchTokens } from "@/hooks/use-search-tokens";
import { Text } from "@/components/text";

export default function Collections(): ReactElement {
  const { auth } = useAuth();
  const { data: collections, isPending: isListCollectionsPending } =
    useListCollections();
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const { data: searchTokens, isLoading: isSearching } = useSearchTokens(query);
  const {
    data: { count: totalTokenCount } = { count: 0 },
    isPending: isTotalTokenCountPending,
    refetch: refetchTotalTokenCount,
  } = useGetTotalTokenCount();

  const totalTokensInSeedData = countTotalTokensInSeedData();

  useEffect(() => {
    if (
      collections &&
      collections?.length > 0 &&
      !isTotalTokenCountPending &&
      totalTokenCount < totalTokensInSeedData
    ) {
      const interval = setInterval(() => {
        refetchTotalTokenCount();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [
    collections,
    isTotalTokenCountPending,
    refetchTotalTokenCount,
    totalTokenCount,
    totalTokensInSeedData,
  ]);

  const handleSearch = useCallback(
    (input: string = searchInput): void => {
      setShowGuide(false);
      setQuery(input);
    },
    [searchInput],
  );

  if (isListCollectionsPending) {
    return <Loading />;
  }

  if (collections?.length === 0) {
    return <EmptyCollectionView />;
  }

  return (
    <>
      <Heading>Good afternoon, {auth?.name ?? ""}</Heading>
      {collections &&
        collections.length > 0 &&
        totalTokenCount < totalTokensInSeedData && (
          <div className="mt-6">
            <Text>
              Only {totalTokenCount} of {totalTokensInSeedData} tokens are
              indexed. Ensure at least 75% are indexed before searching.
            </Text>
            <div className="overflow-hidden rounded-full bg-gray-200 mt-2">
              <div
                style={{
                  width: `${(totalTokenCount / totalTokensInSeedData) * 100}%`,
                }}
                className="h-2 rounded-full bg-orange-600"
              />
            </div>
          </div>
        )}
      <SearchSection
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        isSearching={isSearching}
        showGuide={showGuide}
        setShowGuide={setShowGuide}
      />
      {showGuide && (
        <GuideSection
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
      )}
      {!isSearching ? (
        <SearchResults searchTokens={searchTokens} query={query} />
      ) : (
        <Text className="mt-4">Searching...</Text>
      )}
    </>
  );
}
