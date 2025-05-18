import type React from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import ProtectDashboard from "@/provider/protected-provider";
// import { AuthProvider } from "@/providers/auth-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <ProtectDashboard>
       <div className="flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
     </ProtectDashboard>
  );
}
