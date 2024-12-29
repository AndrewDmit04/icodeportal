import AdminHoursDashboard from '@/app/components/shared/TimeSheets/AdminSheet';
import UserHoursDashboard from '@/app/components/shared/TimeSheets/UserSheet';
import { getRole } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server';

import React from 'react'

const Sheet = async() => {

  const user = await currentUser();
    if(!user){return}

  const isAdmin = role === "Director"
  return (
    <div>
        {isAdmin ? <AdminHoursDashboard id={user.id}/> : <UserHoursDashboard id={user.id}/> }
    </div>
  )
}

export default Sheet