import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/actions/user.actions';


const DashBoard = async () => {
  const user = await currentUser();
  if(!user){
    redirect('/sign-in');
  }
  
  const monUser : any = await getUser({id : user.id});
  if(!monUser || !monUser.onboarded){
    redirect('/onboarding')
    return null
  }

  return (
    <div>DashBoard</div>
  )
}

export default DashBoard