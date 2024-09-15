import * as ddb from "@aws-appsync/utils/dynamodb";

export function request() {
  return ddb.scan({});
}

export function response(ctx) {
  const collections = ctx.result.items.map((collection) => ({
    name: collection.name,
    slug: collection.slug,
  }));
  ctx.stash.collections = collections;
  return collections;
}
