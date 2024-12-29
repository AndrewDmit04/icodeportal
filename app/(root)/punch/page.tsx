import AdminPunch from '@/app/components/shared/punch/AdminPunch';
import UserPunch from '@/app/components/shared/punch/UserPunch';
import { getRole, getUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Clock = async() => {
  const user = await currentUser();
  if(!user){return}
  const role = await getRole({id : user.id});
  const isAdmin = role === "Director"
  return (
    <div>
        {isAdmin ? <AdminPunch id={user.id}/> : <UserPunch id={user.id}/> }
    </div>
  )
}

export default Clock