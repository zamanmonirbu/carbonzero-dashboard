/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/pagination";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import ListOfAdminSuperAdmin from "./listOfAdminSuperAdmin";
import { Input } from "@/components/ui/input";
import { Search, Trash } from "lucide-react";
import Adduser from "./add-user";
import { toast } from "sonner";

// Define the User type
interface User {
  uniqueCode: string;
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

export default function UserManagement() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [token, setToken] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedToken = sessionStorage.getItem("authToken");
    const localToken = localStorage.getItem("authToken");
    setToken(storedToken || localToken);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profiles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/user/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      toast("User deleted", {
        description: "The user has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setSelectedUserEmail(null);
    },
    onError: () => {
      toast("Failed to delete", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  const filteredUsers =
    data?.data.filter((user: User) =>
      [user.fullName, user.email, user.phoneNumber, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    ) ?? [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mb-10">
        {user?.role === "SuperAdmin" && <ListOfAdminSuperAdmin />}
      </div>

      <div className="w-full bg-white shadow-[0px_0px_6px_0px_#00000040] rounded-xl p-6">
        <div className="mb-6 grid grid-cols-3 items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Management
          </h2>

          <div className="justify-self-center relative w-full max-w-sm">
            <Input
              type="text"
              className="pl-10"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="absolute top-3 left-3 text-gray-500" size={15} />
          </div>

          {user?.role === "SuperAdmin" && (
            <div className="justify-self-end">
              <Button onClick={() => setModalOpen(true)}>Add User</Button>

              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>Add your user</DialogDescription>
                  </DialogHeader>
                  <Adduser setModalOpen={setModalOpen} />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-center py-4">Name</TableHead>
                    <TableHead className="text-center py-4">Phone</TableHead>
                    <TableHead className="text-center py-4">Email</TableHead>
                    <TableHead className="text-center py-4">
                      Unique Code
                    </TableHead>
                    <TableHead className="text-center py-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user: User) => (
                    <TableRow
                      key={user._id}
                      onClick={() =>
                        router.push(`/detailsuserbycompany/${user._id}`)
                      }
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="text-center py-4">
                        {user.fullName}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {user.phoneNumber}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {user.uniqueCode || "N/A"}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUserEmail(user.email);
                            setConfirmDeleteDialog(true);
                          }}
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </div>
          </>
        )}
      </div>

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog}
        onOpenChange={setConfirmDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteDialog(false)}
            >
              No
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedUserEmail) {
                  deleteUser.mutate(selectedUserEmail);
                  setConfirmDeleteDialog(false);
                }
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
