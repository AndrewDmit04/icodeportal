import AdminPunch from '@/app/components/shared/punch/AdminPunch';
import UserPunch from '@/app/components/shared/punch/UserPunch';
import { getAllLocations } from '@/lib/actions/locations.actions';
import { getRole, getUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Clock = async() => {
  const user = await currentUser();
  if(!user){return}
  const role = await getRole({id : user.id});
  const isAdmin = role === "Director" || role === "Owner"
  const locations = await getAllLocations();
  return (
    <div>
        {/* testing */}
        {isAdmin ? <AdminPunch id={user.id} locations={locations}/> : <UserPunch id={user.id}/> }
    </div>
  )
}

export default Clock