import { AdminGuard } from "@/app/(admin)/components/AdminGuard/AdminGuard";
import { AdminSidebar } from "@/app/(admin)/components/AdminSideBar/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-bg">
        <AdminSidebar />
        <main className="ml-56 min-h-screen">{children}</main>
      </div>
    </AdminGuard>
  );
}
