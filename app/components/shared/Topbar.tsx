import React from 'react'
import Link from "next/link"
import Image from "next/image"
import {dark} from '@clerk/themes'
import { OrganizationSwitcher, SignOutButton, SignedIn, UserButton } from '@clerk/nextjs'
const Topbar = () => {
  return (
    <nav className='flex justify-between px-10 py-3'>
      <Link href='/' className='flex items-center gap-4'>
        <h1 className='text-bold text-2xl text-light-1 max-xs:hidden'>CodiePortal</h1>
      </Link>
      <div className='flex items-center gap-1'>
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src='/assets/logout.svg'
                  alt="logout"
                  width={24}
                  height={24}
                ></Image>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <UserButton/>
      </div>
    </nav>
  )
}

export default Topbar