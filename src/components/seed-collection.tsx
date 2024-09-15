"use client";
import { useCreateCollection } from "@/hooks/use-create-collection";
import { collections } from "@/seed/collections";
import { tokens } from "@/seed/tokens";

import {
  Alert,
  AlertActions,
  AlertBody,
  AlertDescription,
  AlertTitle,
} from "@/components/alert";
import { Button } from "@/components/button";
import { useState } from "react";
import { useListCollections } from "@/hooks/use-list-collections";
import { useCreateToken } from "@/hooks/use-create-token";

const generateTokenPrice = (
  averagePrice: number,
  floorPrice: number,
): number => {
  const lowerBound = Math.min(averagePrice, floorPrice) * 0.8;
  const upperBound = Math.max(averagePrice, floorPrice) * 1.5;
  const minRange = lowerBound * 0.2;
  const actualRange = Math.max(upperBound - lowerBound, minRange);
  return lowerBound + Math.random() * actualRange;
};

export default function SeedCollection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const { mutateAsync: createCollection } = useCreateCollection();
  const { mutateAsync: createToken } = useCreateToken();
  const { refetch, isRefetching } = useListCollections();

  const handleCreateCollection = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    const createCollectionsPromise = Promise.all(
      collections.map((collection) => createCollection(collection)),
    );

    const createTokensPromise = Promise.all(
      tokens.map((token) => {
        const collection = collections.find(
          (c) => c.slug === token.collection_slug,
        );
        const price = generateTokenPrice(
          collection?.average_price || 1,
          collection?.floor_price || 0.5,
        );
        return createToken({
          ...token,
          identifier: parseInt(token.identifier),
          name: token.name ? token.name : "",
          price: Math.random() > 0.7 ? parseFloat(price.toFixed(4)) : undefined,
          traits: token.traits.sort((a, b) =>
            a.trait_type.localeCompare(b.trait_type),
          ),
        });
      }),
    );

    await Promise.all([createCollectionsPromise, createTokensPromise]);
    setIsSeeding(false);
    await refetch();
    setIsOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Seed Data
      </Button>
      <Alert open={isOpen} onClose={setIsOpen} size="5xl">
        <AlertTitle>NFT Collection Sample Data Disclaimer</AlertTitle>
        <AlertDescription>
          This application includes seed data that features various NFT
          (Non-Fungible Token) collections like Bored Ape Yacht Club, Azuki, and
          others. Please note the following:
        </AlertDescription>
        <AlertBody>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            For Demonstration Purposes Only
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            The seed data is provided exclusively for demo and testing purposes
            to showcase our AI-powered search feature.
          </p>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            No Affiliation or Endorsement
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            We are not affiliated with, endorsed by, or officially connected
            with any NFT collections or their creators mentioned in the data.
          </p>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            No Ownership or Partnership
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            The use of these collection names does not imply ownership,
            partnership, or promotional intent on our part.
          </p>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            Intellectual Property Rights
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            All trademarks, logos, and collection names are the property of
            their respective owners.
          </p>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            No Investment Advice
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            The presence of any NFT collections in this demo data should not be
            interpreted as financial or investment advice, nor as a
            recommendation to purchase any NFTs.
          </p>
          <h3 className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            Data Accuracy and Scope
          </h3>
          <p className="mt-4 text-pretty text-center sm:text-left text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
            The seed data may not reflect current market conditions or
            up-to-date information on the collections. NFT prices in this demo
            are randomly generated based on the floor and average prices of the
            collections. Some NFTs are intentionally left without prices
            (indicating they are not listed), while others have prices randomly
            assigned for demonstration purposes. Additionally, the seed data
            includes only 100 tokens per collection for testing purposes.
          </p>
          <p className="mt-6 text-balance text-center text-base/6 font-semibold text-zinc-950 sm:text-wrap sm:text-left sm:text-sm/6 dark:text-white">
            By using this application, you acknowledge and agree to these terms.
          </p>
        </AlertBody>
        <AlertActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleCreateCollection()}
            disabled={isSeeding || isRefetching}
          >
            {isSeeding || isRefetching ? "Seeding..." : "Accept & Seed Data"}
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
