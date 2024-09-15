"use client";
import { Divider } from "@/components/divider";
import { Heading, Subheading } from "@/components/heading";
import { useGetCollection } from "@/hooks/use-get-collection";
import { Badge } from "@/components/badge";
import { notFound } from "next/navigation";
import { useListTokens } from "@/hooks/use-list-tokens";
import formatPrice from "@/util/format-price";
import Tokens from "@/components/tokens";

export function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
        {formatPrice(value)}
      </div>
    </div>
  );
}

export default function Collections({ params }: { params: { slug: string } }) {
  const { data: collection, isPending } = useGetCollection(params.slug);
  const { data: tokens } = useListTokens(params.slug);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!collection) {
    notFound();
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Heading>{collection.name}</Heading>
        <Badge color="orange" className="uppercase">
          {collection.category}
        </Badge>
      </div>
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
      </div>
      <div className="mt-4 grid gap-8 grid-cols-2">
        <Stat title="Average Price" value={collection.average_price ?? 0} />
        <Stat title="Floor Price" value={collection.floor_price ?? 0} />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
        <div className="max-sm:w-full sm:flex-1">
          <Heading>Tokens</Heading>
        </div>
      </div>
      {tokens && tokens?.length > 0 && <Tokens tokens={tokens} />}
    </>
  );
}
