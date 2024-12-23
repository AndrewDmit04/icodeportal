import AdminPunch from '@/app/components/shared/punch/AdminPunch';
import UserPunch from '@/app/components/shared/punch/UserPunch';
import AdminHoursDashboard from '@/app/components/shared/TimeSheets/AdminSheet';
import { getRole, getUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Sheet = async() => {
  const user = await currentUser();
  if(!user){return}
  const role = await getRole({id : user.id});
  const isAdmin = role === "Director"
  return (
    <div>
        {isAdmin ? <AdminHoursDashboard id={user.id}/> : <UserPunch id={user.id}/> }
    </div>
  )
}

export default Sheet