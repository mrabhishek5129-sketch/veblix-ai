import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — only on desktop */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>

        {/* Main content — extra bottom padding on mobile for nav bar */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 lg:px-10 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav — only on mobile */}
      <MobileBottomNav />
    </div>
  );
}
