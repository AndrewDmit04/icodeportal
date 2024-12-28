
import Link from 'next/link'
import React from 'react'

const Verification = ({user} : any) => {
  
  const userData = {
    id : user.sub,
    image : user.picture
  }
  return (
    <div>
      <div className='fixed flex justify-center w-full items-center'>
          <div className='flex items-center'>
          <img src={userData.image} alt={userData.id} className='w-10 h-10 m-1 rounded-full '/>
          <p>Current Account</p>
          </div>
          <Link href='/api/auth/logout' className='text-center text-white bg-red-500 rounded-sm p-2 m-5 hover:bg-red-400 transition-all'>LogOut</Link>
      </div>
        <div className="w-100 h-screen flex justify-center items-center">
          <h1 className="text-red-400 text-5xl">Awating verification </h1>
        </div>
    </div>
  )
}

export default Verification