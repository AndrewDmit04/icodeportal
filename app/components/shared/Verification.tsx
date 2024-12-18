
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const Verification = () => {
  return (
    <body>
        <div className="m-5 fixed flex">
            <UserButton></UserButton>
            <h1>Current Account</h1>
        </div>
        <div className="w-100 h-screen flex justify-center items-center">
          <h1 className="text-red-400 text-5xl">Awating verification </h1>
        </div>
    </body>
  )
}

export default Verification