// collections/GuideSection.tsx
import React, { ReactElement } from "react";
import { Text, TextLink } from "@/components/text";
import { Divider } from "@/components/divider";
import { Heading, Subheading } from "@/components/heading";

const EXAMPLE_PROMPTS: string[] = [
  "Show me Bored Apes for sale under 100 ETH",
  "Find NFTs with crazy eyes",
  "What are the priciest Azuki NFTs right now?",
  "Which Doodles NFTs aren't listed for sale yet?",
  "I'm looking for NFTs between 1 and 5 ETH, show me the cheapest ones first",
];

export default function GuideSection({
  setSearchInput,
  handleSearch,
}: {
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (input: string) => void;
}): ReactElement {
  return (
    <div className="mt-6">
      <Heading>AI-Assisted NFT Search Guide</Heading>
      <Text>
        Welcome to our AI-powered NFT search feature! This tool allows you to
        search for NFTs using natural language queries. Our AI assistant will
        interpret your input and generate the appropriate search query to find
        the NFTs you&apos;re looking for.
      </Text>
      <Divider className="my-4" />
      <Subheading>How It Works</Subheading>
      <Text>
        Simply type your search request as you would ask a person. The AI will
        understand your intent and search across various NFT attributes like
        price, traits, collections, and more.
      </Text>
      <Subheading className="mt-4">Sample Prompts</Subheading>
      <Text>Try these example prompts to get started:</Text>
      <ol className="list-decimal ml-8 text-base/6 sm:text-sm/6">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <li key={prompt}>
            <TextLink
              href="#"
              onClick={() => {
                setSearchInput(prompt);
                handleSearch(prompt);
              }}
            >
              {prompt}
            </TextLink>
          </li>
        ))}
      </ol>
      <Subheading className="mt-4">Tips for Effective Searching</Subheading>
      <ul className="list-disc ml-8 text-base/6 sm:text-sm/6 text-zinc-500 dark:text-zinc-400">
        <li>
          Be specific about traits, prices, or collections you&apos;re
          interested in.
        </li>
        <li>You can combine multiple criteria in a single search.</li>
        <li>Feel free to use natural language - the AI understands context!</li>
      </ul>
      <Subheading className="mt-4">Disclaimer</Subheading>
      <Text>
        This application uses seed data for demonstration purposes only. We are
        not affiliated with or endorsed by any NFT collections mentioned. All
        trademarks and collection names belong to their respective owners. The
        data may not reflect current market conditions and should not be
        considered investment advice. By using this feature, you acknowledge
        that the information is for testing our AI search capabilities only.
      </Text>
    </div>
  );
}
