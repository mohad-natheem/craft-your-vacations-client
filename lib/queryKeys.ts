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
  bookings: {
    my: () => ['bookings', 'my'] as const,
  },
  reviews: {
    byDestination: (slug: string) => ['reviews', 'destination', slug] as const,
    approved: () => ['reviews', 'approved'] as const,
  },
} as const;
 