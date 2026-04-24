export const queryKeys = {
  destinations: {
    all: () => ['destinations'] as const,
    detail: (slug: string) => ['destinations', 'detail', slug] as const,
  },
  packages: {
    detail: (slug: string, key: string) => ['packages', 'detail', slug, key] as const,
  },
  profile: {
    me: () => ['profile', 'me'] as const,
  },
} as const;
 