import { Navbar } from "@/components/Navbar/NavBar";
import { RootGuard } from "@/components/RootGuard/RootGuard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootGuard>
      <Navbar />
      <main>{children}</main>
    </RootGuard>
  );
}
