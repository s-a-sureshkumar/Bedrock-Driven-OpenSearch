import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Schema } from "~/amplify/data/resource";
import { generateClient } from "@aws-amplify/api";

export const useSearchTokens = (
  q: string,
): UseQueryResult<Schema["Token"]["type"][]> => {
  const client = generateClient<Schema>();

  return useQuery({
    queryFn: async () => {
      const response = await client.queries.search({
        q,
      });

      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors
          .map((error) => error.message)
          .join(", ");
        throw new Error(errorMessage);
      }

      return response.data;
    },
    queryKey: ["tokens-search", q],
    refetchOnWindowFocus: false,
    enabled: Boolean(client && q && q.length > 0),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
