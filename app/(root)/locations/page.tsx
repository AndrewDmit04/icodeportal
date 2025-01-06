import LocationsPage from '@/app/components/locations/locations'
import { getRole } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

const Locations = async () => {
  const user = await currentUser();
  if(!user){return}
  const role = await getRole({id : user.id});

  const isAdmin = role === "Owner"
  if(!isAdmin){redirect('/punch')}
  return (
    <div>
      <LocationsPage id={user.id}/>
    </div>
  )
}

export default Locations