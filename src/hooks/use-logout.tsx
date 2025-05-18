"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useLogout() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  const showLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const hideLogoutModal = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    // Perform logout actions here (clear tokens, cookies, etc.)
    // Then redirect to login page
    hideLogoutModal();
    router.push("/login");
  }, [hideLogoutModal, router]);

  return {
    isLogoutModalOpen,
    showLogoutModal,
    hideLogoutModal,
    handleLogout,
  };
}
