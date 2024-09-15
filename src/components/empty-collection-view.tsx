// collections/EmptyCollectionView.tsx
import React, { ReactElement } from "react";
import { Text } from "@/components/text";
import { Divider } from "@/components/divider";
import SeedCollection from "@/components/seed-collection";

export default function EmptyCollectionView(): ReactElement {
  return (
    <div className="mt-4 text-zinc-500">
      <Text>No data found. Would you like to seed it?</Text>
      <Divider className="my-4" soft />
      <SeedCollection />
    </div>
  );
}
