// collections/Loading.tsx
import React, { ReactElement } from "react";
import { Text } from "@/components/text";

export default function Loading(): ReactElement {
  return (
    <div className="mt-4 text-zinc-500">
      <Text>Loading...</Text>
    </div>
  );
}
