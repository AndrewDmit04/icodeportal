
import { SignedOut, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Verification = () => {
  return (
    <div>
        <div className="m-5 fixed flex flex-col justify-center items-center gap-1 w-full">
            <div className='flex gap-2 items-center'>
              <UserButton></UserButton>
              <h1>Current Account</h1>
            </div>
            <SignOutButton>
              <button className='p-2 bg-red-500 rounded-md text-white'>Sign Out</button>
            </SignOutButton>
        </div>
        <div className="w-100 h-screen flex justify-center items-center">
          <h1 className="text-red-400 text-5xl">Awating verification </h1>
        </div>
    </div>
  )
}

export default Verification