"use client";
import { usePathname, useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import avater from "@/Public/assets/avater.png";
// import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  // console.log("user", user?.user?.fullName)
  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/company") return "Company";
    if (pathname.includes("/subscription-payment"))
      return "Subscription & Payment";
    if (pathname === "/blogs") return "Blogs";
    if (pathname === "/notification") return "Notification";
    if (pathname === "/financial") return "Financial";
    if (pathname === "/emission-form") return "Emission Form";
    if (pathname.includes("/users")) return "Users";

    return "Dashboard";
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon" className="text-gray-500">
            <MessageSquare className="h-5 w-5" />
          </Button> */}
          <Link href="/notification">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full border border-primary"
              >
                <Avatar>
                  <AvatarImage src={user?.image} />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "user"}{" "}
                  </p>
                  <p className="text-sm py-2 leading-none">
                    {user?.email || "mail"}{" "}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Role: {user?.role || "user"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.refresh();
                }}
                className="text-red-500"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
