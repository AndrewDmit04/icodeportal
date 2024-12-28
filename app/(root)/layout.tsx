import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/shared/sidebar/Sidebar";
import { getUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Verification from "../components/shared/Verification";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';



export const metadata ={
  title : "Portal",
  description : "A Next.js icode Portal Application"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  const user = session.user;

  const monUser: any = await getUser({ id: user.sub });
  if (!monUser || !monUser.onboarded) {
    redirect("/onboarding");
    return null;
  }

  const verified = monUser.verified;

  return (
    // <ClerkProvider>
      <html lang="en">
        <UserProvider>
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
            <Verification user={user}/>
          )}
        </body>
        </UserProvider>
      </html>

  );
}
