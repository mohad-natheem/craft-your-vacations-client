export const queryKeys = {
  destinations: {
    all: () => ['destinations'] as const,
    detail: (slug: string) => ['destinations', 'detail', slug] as const,
  },
} as const;
 