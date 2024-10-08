export function request(ctx) {
  const body = ctx.prev.result;
  return {
    operation: "GET",
    path: "/tokens/_search",
    params: {
      body: body,
    },
  };
}

export function response(ctx) {
  return {
    tokens: (ctx.result?.hits?.hits ?? []).map((hit) => hit._source) ?? [],
    query: ctx.prev.result,
  };
}
