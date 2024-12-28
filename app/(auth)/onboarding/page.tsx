
import ProfileForm from '@/app/components/forms/AccountProfile'
import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import Link from 'next/link'




const page = async () => {

  const session = await getSession();
  if (!session) {
    redirect("/api/auth/login");
  }
  const user = session.user;
  
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