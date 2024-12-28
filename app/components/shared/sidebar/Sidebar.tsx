// import { Calendar, Search, Settings, LayoutDashboardIcon, TimerIcon} from "lucide-react"
import { adminContents } from "./sidebars/admin"
import {userContents} from "./sidebars/user"
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
import Image from "next/image"


export async function AppSidebar() {
  // const user = await currentUser();
  // if(!user){return}
  // const role = await getRole({id : user.id});
  // const items = role === "Director" ? adminContents : userContents;
  const items = adminContents
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex gap-2">
                <Image src="/assets/icode.jpg" alt="nice" width={35} height={35}></Image>
                <h1 className="text-black text-xl">Portal</h1>
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


                <Link className="text-center text-white bg-red-500 rounded-sm hover:bg-red-400 transition-all" href={"/api/auth/logout"}>LogOut</Link>

            
        </SidebarFooter>
    </Sidebar>
  )
}
