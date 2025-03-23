"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Search } from "lucide-react"

export default function SearchButton() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="cursor-pointer">
          <Search/>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <VisuallyHidden>
              <DrawerTitle>Search</DrawerTitle>
            </VisuallyHidden>
            <div className="w-full flex justify-center">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-full max-w-md"
                autoFocus
              />
            </div>
          </DrawerHeader>
          {/* Content area - empty for now */}
          <div className="p-4 w-full min-h-[70vh]">
            
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}