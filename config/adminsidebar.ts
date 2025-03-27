import { Calendar, Home, Inbox, ListOrderedIcon, Search, Settings, ShoppingBagIcon, Sun, Users } from "lucide-react";

export const adminmenu = [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: ShoppingBagIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ListOrderedIcon,
    },
    {
      title: "Coupons",
      url: "/admin/coupons",
      icon: Sun,
    },
  ]