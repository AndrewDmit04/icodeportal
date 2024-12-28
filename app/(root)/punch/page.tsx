import AdminPunch from '@/app/components/shared/punch/AdminPunch';
import UserPunch from '@/app/components/shared/punch/UserPunch';
import { getRole} from '@/lib/actions/user.actions'
import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import React from 'react'

const Clock = async() => {
  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  const user = session.user;
  
  const role = await getRole({id : user.sub});
  const isAdmin = role === "Director"
  return (
    <div>
        {isAdmin ? <AdminPunch id={user.sub}/> : <UserPunch id={user.sub}/> }
    </div>
  )
}

export default Clock