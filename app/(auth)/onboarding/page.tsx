
import ProfileForm from '@/app/components/forms/AccountProfile'
import React, { useEffect } from 'react'
import { createOrFindUser } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import Link from 'next/link'
import { handleLogout } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button'



const page = async () => {
  const sessionCookies = await cookies();

  const logoutOfSession = async () =>{
    
  }

  // Use the session cookies or get the session
  const session = await getSession();

  // console.log(sessionCookies.getAll()); // Safely access cookies
  // const user = await currentUser();
  if (!session) {
    redirect("/api/auth/login");
  }
  const user = session.user;

  
  // const user = await currentUser();
  // if(!user){redirect('/sign-in')}
  
  const userData = {
    id : user.sub,
    image : user.picture
  }
  return (
    <>
      <div className='fixed flex justify-center w-full items-center'>
          <div className='flex items-center'>
          <img src={userData.image} alt={userData.id} className='w-10 h-10 m-1 rounded-full '/>
          <p>Current Account</p>
          </div>
          <Link href='/api/auth/logout' className='text-center text-white bg-red-500 rounded-sm p-2 m-5 hover:bg-red-400 transition-all'>LogOut</Link>
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