import { Navbar } from "@/components/Navbar/NavBar";
import { RootGuard } from "@/components/RootGuard/RootGuard";
import WhatsAppFAB from "@/components/WhatsAppFAB/WhatsAppFAB";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootGuard>
      <Navbar />
      <main>{children}</main>
      <WhatsAppFAB />
    </RootGuard>
  );
}
