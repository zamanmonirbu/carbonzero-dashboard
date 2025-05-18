"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();


  useEffect(() => {
    // Use a small timeout to ensure the router is ready
    const redirectTimer = setTimeout(() => {
      router.replace("/dashboard");
    }, 100);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
        <p className="text-lg font-medium">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
