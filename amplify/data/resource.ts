import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Collection: a
    .model({
      slug: a.string().required(),
      name: a.string(),
      category: a.string(),
      average_price: a.float(),
      floor_price: a.float(),
    })
    .identifier(["slug"])
    .authorization((allow) => [allow.authenticated()]),

  Trait: a.customType({
    trait_type: a.string(),
    value: a.string(),
  }),

  Token: a
    .model({
      collection_slug: a.string().required(),
      identifier: a.integer().required(),
      name: a.string(),
      image_url: a.string(),
      traits: a.ref("Trait").array(),
      price: a.float(),
    })
    .identifier(["collection_slug", "identifier"])
    .authorization((allow) => [allow.authenticated()]),

  search: a
    .query()
    .arguments({ q: a.string().required() })
    .returns(a.ref("Token").array())
    .authorization((allow) => [allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: "OpenSearchDataSource",
        entry: "./search/get-mappings.js",
      }),
      a.handler.custom({
        dataSource: a.ref("Collection"),
        entry: "./search/list-collections.js",
      }),
      a.handler.custom({
        dataSource: "BedrockDataSource",
        entry: "./search/transform-user-input-to-query.js",
      }),
      a.handler.custom({
        dataSource: "OpenSearchDataSource",
        entry: "./search/search.js",
      }),
    ]),

  getTotalTokenCount: a
    .query()
    .returns(
      a.customType({
        count: a.integer(),
      }),
    )
    .authorization((allow) => [allow.authenticated()])
    .handler([
      a.handler.custom({
        dataSource: "OpenSearchDataSource",
        entry: "./get-total-token-count.js",
      }),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
