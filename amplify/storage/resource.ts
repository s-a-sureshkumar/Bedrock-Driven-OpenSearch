import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "bedrock-driven-open-search-storage",
  access: (allow) => ({
    "public/*": [allow.guest.to(["list", "write", "get"])],
  }),
});
