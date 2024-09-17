import React, { ReactElement } from "react";
import { Text } from "@/components/text";
import Tokens from "@/components/tokens";
import { Schema } from "~/amplify/data/resource";

export default function SearchResults({
  searchTokens,
  query,
}: {
  searchTokens: (Schema["TokenResult"]["type"] | undefined | null)[] | null;
  query: string;
}): ReactElement {
  if (!query) {
    return <Text className="mt-4 text-zinc-500">Enjoy exploring NFTs!</Text>;
  }

  if (!searchTokens || searchTokens.length === 0) {
    return <Text className="mt-4 text-zinc-500">No tokens found.</Text>;
  }

  return <Tokens tokens={searchTokens} />;
}
