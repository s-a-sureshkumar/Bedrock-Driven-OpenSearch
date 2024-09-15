export function request() {
  return {
    operation: "GET",
    path: "/tokens/_count",
    params: {},
  };
}

export function response(ctx) {
  return {
    count: ctx.result?.count ?? 0,
  };
}
