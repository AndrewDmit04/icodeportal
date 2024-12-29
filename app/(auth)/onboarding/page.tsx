
import ProfileForm from '@/app/components/forms/AccountProfile'
import React, { useEffect } from 'react'
import { createOrFindUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
const page = async () => {
  const user = await currentUser();
  if(!user){redirect('/sign-in')}
  
  const userData = {
    id : user.id,
    image : user.imageUrl
  }
  return (
    <>
      <div className='flex'>
        <UserButton/>
        <h1>Current account</h1>
      </div>
      
      <div className='flex w-100 h-screen align items-center justify-center'>
        <div>
          <h1>Onboarding</h1>
          <ProfileForm user={userData}/>
        </div>
      </div>
    </>

  )
}

export default page