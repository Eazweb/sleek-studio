import UserMenu from "@/components/Header/UserMenu"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="w-full flex justify-between items-center px-5 py-3">
          <SidebarTrigger />
          <Link href='/'>
            <h1>Sleek Studio</h1>
        </Link>
        <UserMenu/>
        </div>
        <div className="w-[90%] mx-auto">
        {children}
        </div>
      </main>
    </SidebarProvider>
  )
}