import { AdminGuard } from "@/app/(admin)/components/AdminGuard/AdminGuard";
import { AdminSidebar } from "@/app/(admin)/components/AdminSideBar/AdminSideBar";
import { AdminMobileTopBar } from "@/app/(admin)/components/AdminMobileTopBar/AdminMobileTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-bg">
        <AdminMobileTopBar />
        <AdminSidebar />
        <main className="md:ml-56 min-h-screen pt-14 md:pt-0">{children}</main>
      </div>
    </AdminGuard>
  );
}
