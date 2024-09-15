import { Divider } from "@/components/divider";
import formatPrice from "@/util/format-price";
import { Badge } from "@/components/badge";
import { Schema } from "~/amplify/data/resource";

export default function Tokens({
  tokens,
}: {
  tokens: Schema["Token"]["type"][];
}) {
  return (
    <>
      <ul className="mt-4">
        {tokens?.map((token, index) => (
          <li key={`${token.collection_slug}-${token.identifier}`}>
            <Divider soft={index > 0} />
            <div className="flex items-center justify-between">
              <div
                key={`${token.collection_slug}-${token.identifier}`}
                className="flex gap-6 py-6 flex-grow"
              >
                <div className="w-32 shrink-0">
                  <img
                    className="rounded-lg shadow"
                    src={token.image_url!}
                    alt=""
                  />
                </div>
                <div className="space-y-1.5 w-full">
                  <div className="text-base/6 font-semibold">
                    {token.name || token.identifier}
                  </div>
                  {token.price && (
                    <div className="text-xs/6 text-zinc-600">
                      {formatPrice(token.price ?? 0)}
                    </div>
                  )}
                  <div className="text-xs/6 text-zinc-500 grid gap-1 grid-cols-1 md:grid-cols-3">
                    {token.traits?.map((trait) => (
                      <div key={trait?.trait_type}>
                        <span className="font-semibold">
                          {trait?.trait_type}:
                        </span>{" "}
                        {trait?.value}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  className="max-sm:hidden"
                  color={token.price ? "orange" : "zinc"}
                >
                  {token.price ? "Listed" : "Not Listed"}
                </Badge>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
