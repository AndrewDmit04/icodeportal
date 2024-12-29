
import ProfileForm from '@/app/components/forms/AccountProfile'
import React from 'react'
import { redirect } from 'next/navigation'

import { SignOutButton, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
const page = async () => {
  const user = await currentUser();
  if(!user){redirect('/sign-in')}

  
  const userData = {
    id : user.id,
    image : user.imageUrl
  }
  return (
    <>
        <div className="m-5 fixed flex flex-col justify-center items-center gap-1 w-full">
            <div className='flex gap-2 items-center'>
              <UserButton></UserButton>
              <h1>Current Account</h1>
            </div>
            <SignOutButton>
              <button className='p-2 bg-red-500 rounded-md text-white'>Sign Out</button>
            </SignOutButton>
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