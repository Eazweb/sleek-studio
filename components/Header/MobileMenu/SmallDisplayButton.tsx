'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { menuData } from "@/Types/type";

export default function SmallDisplayButton() {
  const [name, setName] = useState("Pedro Duarte");
  const [username, setUsername] = useState("@peduarte");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl">Sleek Studio</SheetTitle>
        </SheetHeader>
        <MobileMenu items={menuData} />
      </SheetContent>
    </Sheet>
  )
}