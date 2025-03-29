import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is admin
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
  
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
} 