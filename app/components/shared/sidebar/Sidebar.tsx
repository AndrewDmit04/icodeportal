// import { Calendar, Search, Settings, LayoutDashboardIcon, TimerIcon} from "lucide-react"
import { adminContents } from "./sidebars/admin"
import {userContents} from "./sidebars/user"
import { OwnerContents } from "./sidebars/owner"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import { SignOutButton, UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { getRole } from "@/lib/actions/user.actions"
import Image from "next/image"


export async function AppSidebar() {
  const user = await currentUser();
  if(!user){return}
  const role = await getRole({id : user.id});
  let items;
  if (role === "Owner"){
    items = OwnerContents;
  } else if (role === "Director"){
    items = adminContents;
  }
  else {
    items = userContents;
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                  <Image src="/assets/icode.jpg" alt="nice" width={35} height={35}></Image>
                  <h1 className="text-black text-xl">Portal</h1>
                </div>
                <div className="flex gap-2 items-center">
                  <UserButton></UserButton>
                </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-10 mt-10">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="!w-9 !h-9"/>
                      <span className="text-3xl">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
            <div className="flex flex-col gap-2 w-full items-center justify-center">
                <SignOutButton>
                  <button className='p-2 bg-red-500 rounded-md text-white w-full'>Sign Out</button>
                </SignOutButton>
            </div>
            
        </SidebarFooter>
    </Sidebar>
  )
}
