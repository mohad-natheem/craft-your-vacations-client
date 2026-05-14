import { create } from "zustand";

interface UIStore {
  mobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  adminSidebarOpen: boolean;
  openAdminSidebar: () => void;
  closeAdminSidebar: () => void;
  toggleAdminSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  adminSidebarOpen: false,
  openAdminSidebar: () => set({ adminSidebarOpen: true }),
  closeAdminSidebar: () => set({ adminSidebarOpen: false }),
  toggleAdminSidebar: () => set((s) => ({ adminSidebarOpen: !s.adminSidebarOpen })),
}));
