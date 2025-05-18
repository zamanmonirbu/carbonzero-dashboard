"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  FileText,
  Bell,
  LogOut,
  Users,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/Public/assets/fomrLogo.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // ✅ Import auth context

const Sidebar = () => {
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuth(); // ✅ Grab user role

  const showLogoutModal = () => setIsLogoutModalOpen(true);
  const hideLogoutModal = () => setIsLogoutModalOpen(false);

  const commonRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    // {
    //   label: "Company",
    //   icon: Building2,
    //   href: "/company",
    // },
    {
      label: "Blogs",
      icon: FileText,
      href: "/blogs",
    },
    {
      label: "Notification",
      icon: Bell,
      href: "/notification",
    },
  ];

  const superAdminRoutes = [
    {
      label: "Subscription",
      icon: CreditCard,
      href: "/subscription-payment",
    },
    {
      label: "Financial",
      icon: Building2,
      href: "/financial",
    },
    // {
    //   label: "Emission Form",
    //   icon: FileText,
    //   href: "/emission-form",
    // },
    {
      label: "Users",
      icon: Users,
      href: "/users",
    },
    {
      label: "Newsletter",
      icon: Newspaper,
      href: "/newsletter",
    },
  ];

  const adminRoutes = [
    {
      label: "Subscriptions",
      icon: CreditCard,
      href: "/subscription-payment",
    },
  ];

  const routes = [
    ...commonRoutes,
    ...(user?.role === "SuperAdmin"
      ? superAdminRoutes
      : user?.role === "Admin"
      ? adminRoutes
      : []),
  ];

  return (
    <>
      <div className="sidebar min-h-screen w-[354px] flex flex-col overflow-y-auto">
        <div className="p-4 flex items-center -ml-[150px] justify-center gap-2 mb-[32px] text-white">
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              width={500}
              height={500}
              alt="logo"
              className="w-[150px]"
            />
            <p className="-ml-[30px] text-[14px] font-medium text-[#09B850]">
              {" "}
              Going 2<span className={"text-white ml-1"}>Zero</span>
            </p>
          </Link>
        </div>
        <div className="flex-1 px-3 py-2 space-y-[30px]">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-white transition-colors",
                pathname === route.href ||
                  (route.href !== "/dashboard" && pathname.includes(route.href))
                  ? "active-nav-link"
                  : "hover:bg-primary/10"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}

          <button
            onClick={showLogoutModal}
            className="w-full text-red-500 flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-primary/10"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            Log Out
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#033618] text-white border-none">
          <DialogHeader className="flex items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className=" flex justify-center">
                <div className=" flex justify-center">
                  <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                      <Image
                        src={logo}
                        alt="Business Consultation"
                        width={150}
                        height={150}
                      />
                      <p className="-ml-[30px] text-[14px] font-medium text-[#09B850]">
                        {" "}
                        Going 2{"  "}
                        <span className={"text-white"}>Zero</span>
                      </p>
                    </Link>
                    {/* <Image
              src="/asset/fomrLogo.png"
              alt="Business Consultation Logo"
              width={140}
              height={140}
              className="mr-2"
            /> */}
                  </div>
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Are You Sure to Log Out?
            </DialogTitle>
            <DialogDescription className="text-center text-white/80">
              Stay ahead with the latest security, updates and expert insights
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:gap-2">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={hideLogoutModal}
            >
              No
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent border-green-500 text-green-400 hover:bg-green-900/20 hover:text-green-300"
              onClick={logout}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;
