import AdminPunch from '@/app/components/shared/punch/AdminPunch';
import UserPunch from '@/app/components/shared/punch/UserPunch';
import AdminHoursDashboard from '@/app/components/shared/TimeSheets/AdminSheet';
import UserHoursDashboard from '@/app/components/shared/TimeSheets/UserSheet';
import { getRole, getUser } from '@/lib/actions/user.actions'
import { getSession } from '@auth0/nextjs-auth0';
import { currentUser } from '@clerk/nextjs/server'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'

const Sheet = async() => {
  const sessionCookies = await cookies();
  
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  const user = session.user;
  const role = await getRole({id : user.sub});
  const isAdmin = role === "Director"
  return (
    <div>
        {isAdmin ? <AdminHoursDashboard id={user.sub}/> : <UserHoursDashboard id={user.sub}/> }
    </div>
  )
}

export default Sheet