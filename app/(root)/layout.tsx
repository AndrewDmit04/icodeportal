import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/shared/sidebar/Sidebar";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Verification from "../components/shared/Verification";



export const metadata ={
  title : "Portal",
  description : "A Next.js icode Portal Application"
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const monUser: any = await getUser({ id: user.id });
  if (!monUser || !monUser.onboarded) {
    redirect("/onboarding");
    return null;
  }

  const verified = monUser.verified;

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <title>Portal</title>
        </head>
        <body className="">
          {verified ? (
            <SidebarProvider>
              {/* Sidebar */}
              
              <AppSidebar/>
              {/* Main Content */}
              <SidebarTrigger/>
              <div className="flex-1 overflow-auto p-4">{children}</div>
            </SidebarProvider>
          ) : (
            <Verification />
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
