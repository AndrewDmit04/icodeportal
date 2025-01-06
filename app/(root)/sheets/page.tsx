import AdminHoursDashboard from '@/app/components/shared/TimeSheets/AdminSheet';
import UserHoursDashboard from '@/app/components/shared/TimeSheets/UserSheet';
import { getAllLocations } from '@/lib/actions/locations.actions';
import { getRole } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server';

import React from 'react'

const Sheet = async() => {

  const user = await currentUser();
    if(!user){return}
    const role = await getRole({id : user.id});
  const isAdmin = role === "Director" || role === "Owner"
  const locations = await getAllLocations();
  return (
    <div>
        {isAdmin ? <AdminHoursDashboard id={user.id} locations={locations}/> : <UserHoursDashboard id={user.id}/> }
    </div>
  )
}

export default Sheet