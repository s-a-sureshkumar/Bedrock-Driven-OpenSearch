"use client";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { useListCollections } from "@/hooks/use-list-collections";
import formatPrice from "@/util/format-price";

export default function Collections() {
  const { data: collections } = useListCollections();
  return (
    <>
      <Heading>Collections</Heading>

      {collections?.length === 0 ? (
        <div className="mt-4 text-zinc-500">
          <Text>No data found.</Text>
        </div>
      ) : (
        <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader className="text-right">Average Price</TableHeader>
              <TableHeader className="text-right">Floor Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections?.map((collection) => (
              <TableRow
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                title={`${collection.name}`}
              >
                <TableCell>{collection.name}</TableCell>
                <TableCell className="text-zinc-500 uppercase">
                  {collection.category}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(collection.average_price ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(collection.floor_price ?? 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
