import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { Schema } from "~/amplify/data/resource";
import { generateClient } from "@aws-amplify/api";
export const useCreateCollection = (): UseMutationResult<
  Schema["Collection"]["type"],
  Error | null,
  {
    slug: string;
    name: string;
    category: string;
    average_price: number;
    floor_price: number;
  }
> => {
  const client = generateClient<Schema>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const response = await client.models.Collection.create(input);

      if (response.errors && response.errors.length > 0) {
        const errorMessage = response.errors
          .map((error) => error.message)
          .join(", ");
        throw new Error(errorMessage);
      }

      return response.data as Schema["Collection"]["type"];
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
  });
};
