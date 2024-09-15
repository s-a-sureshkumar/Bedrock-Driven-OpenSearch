export function request() {
  return {
    operation: "GET",
    path: "/tokens/_mapping",
    params: {},
  };
}

export function response(ctx) {
  const mappings = ctx.result;
  ctx.stash.mappings = mappings;
  return mappings;
}
