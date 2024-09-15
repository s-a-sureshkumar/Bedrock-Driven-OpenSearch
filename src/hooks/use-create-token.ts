import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Schema } from "~/amplify/data/resource";
import { generateClient } from "@aws-amplify/api";
export const useCreateToken = (): UseMutationResult<
  Schema["Token"]["type"],
  Error | null,
  {
    collection_slug: string;
    identifier: string;
    name: string;
    image_url: string;
    traits: { trait_type: string; value: string }[];
    price: number | undefined;
  }
> => {
  const client = generateClient<Schema>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const response = await client.models.Token.create(input);

      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors
          .map((error) => error.message)
          .join(", ");
        throw new Error(errorMessage);
      }

      return response.data as Schema["Token"]["type"];
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["tokens"],
      });
    },
  });
};
