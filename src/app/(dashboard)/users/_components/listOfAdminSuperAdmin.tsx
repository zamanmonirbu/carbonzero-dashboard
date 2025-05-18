"use client";
import { Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Addadmin from "./add-admin";
import { Input } from "@/components/ui/input";
import { Search, Trash } from "lucide-react";
import { toast } from "sonner";

interface User {
  uniqueCode: string;
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

const ListOfAdminSuperAdmin = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [token, setToken] = useState<string | null>(null);
  const { user: users } = useAuth();
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

  const { data } = useQuery({
    queryKey: ["adminlist"],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/admin-superAdmin`,
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
      if (!res.ok) throw new Error("Failed to delete admin");
      return res.json();
    },
    onSuccess: () => {
      toast("User deleted", {
        description: "The admin has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["adminlist"] });
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
      [user.fullName, user.email, user.phoneNumber]
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
    <div className="bg-white shadow-[0px_0px_6px_0px_#00000040] mt-20 rounded-xl p-6">
      <div className="mb-6 grid grid-cols-3 items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          List Of Admin And Super Admin
        </h2>

        <div className="justify-self-center relative w-full max-w-sm">
          <Input
            type="text"
            className="pl-10"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
          />
          <Search className="absolute top-3 left-3 text-gray-500" size={15} />
        </div>

        {users?.role === "SuperAdmin" && (
          <div className="justify-self-end">
            <Button onClick={() => setModalOpen(true)}>Add Admin</Button>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Admin</DialogTitle>
                  <DialogDescription>Add your admin</DialogDescription>
                </DialogHeader>
                <Addadmin setModalOpen={setModalOpen} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center py-4">Name</TableHead>
              <TableHead className="text-center py-4">Phone</TableHead>
              <TableHead className="text-center py-4">Role</TableHead>
              <TableHead className="text-center py-4">Email</TableHead>
              <TableHead className="text-center py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user: User) => (
              <TableRow key={user._id}>
                <TableCell className="text-center py-4">
                  {user.fullName}
                </TableCell>
                <TableCell className="text-center py-4">
                  {user.phoneNumber}
                </TableCell>
                <TableCell className="text-center py-4">
                  {user.role}
                </TableCell>
                <TableCell className="text-center py-4">{user.email}</TableCell>
                <TableCell className="text-center py-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
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

      {/* ✅ Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog}
        onOpenChange={setConfirmDeleteDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin?  This action cannot be
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
};

export default ListOfAdminSuperAdmin;
