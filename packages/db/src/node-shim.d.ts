// Local-only ambient declaration so the db package's seed scripts typecheck
// without depending on @types/node. Picked up by db's tsconfig `include`;
// other packages don't load this file (they either have @types/node or use
// globalThis casts).

declare global {
  // eslint-disable-next-line no-var
  var process: {
    env: Record<string, string | undefined>;
    exit(code?: number): never;
  };
}

export {};
