import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Schema } from "~/amplify/data/resource";
import { generateClient } from "@aws-amplify/api";

export const useGetCollection = (
  slug: string,
): UseQueryResult<Schema["Collection"]["type"]> => {
  const client = generateClient<Schema>();

  return useQuery({
    queryFn: async () => {
      const response = await client.models.Collection.get({
        slug,
      });

      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors
          .map((error) => error.message)
          .join(", ");
        throw new Error(errorMessage);
      }

      return response.data;
    },
    queryKey: ["collections", slug],
    refetchOnWindowFocus: false,
    enabled: Boolean(client),
  });
};
