"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export type UserType = Pick<User, "id" | "name" | "email" | "role" | "image" | "createdAt">;

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <span className={`px-2 py-1 rounded-full text-sm ${
          role === "ADMIN" 
            ? "bg-purple-100 text-purple-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return format(date, "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const userId = row.original.id;
      return (
        <Button
          variant="ghost"
          size="icon"
          asChild
        >
          <Link href={`/admin/users/${userId}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      );
    },
  },
]; 