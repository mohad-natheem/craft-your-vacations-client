import { api } from "@/lib/api";
import type { Destination } from "@/app/types/api";

export const destinationsApi = {
  getAll: () => api.get<Destination[]>("destinations"),
};
