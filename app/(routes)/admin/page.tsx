import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Sleek Studio",
  description: "Manage your store",
};

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Welcome back, Admin!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/dashboard" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <LayoutDashboard className="h-12 w-12 mb-4 text-indigo-600" />
          <h2 className="text-xl font-medium">Dashboard</h2>
          <p className="text-gray-500 mt-2">View analytics and store performance</p>
        </Link>       
        <Link href="/admin/products" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <Package className="h-12 w-12 mb-4 text-indigo-600" />
          <h2 className="text-xl font-medium">Products</h2>
          <p className="text-gray-500 mt-2">Manage products and inventory</p>
        </Link>     
        <Link href="/admin/orders" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <ShoppingBag className="h-12 w-12 mb-4 text-indigo-600" />
          <h2 className="text-xl font-medium">Orders</h2>
          <p className="text-gray-500 mt-2">Process and track customer orders</p>
        </Link>      
        <Link href="/admin/users" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <Users className="h-12 w-12 mb-4 text-indigo-600" />
          <h2 className="text-xl font-medium">Users</h2>
          <p className="text-gray-500 mt-2">Manage customers and permissions</p>
        </Link>
        <Link href="/admin/coupons" 
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <Users className="h-12 w-12 mb-4 text-indigo-600" />
          <h2 className="text-xl font-medium">Coupons</h2>
          <p className="text-gray-500 mt-2">Manage coupon codes</p>
        </Link>
      </div>
    </div>
  );
}