
import { redirect } from 'next/navigation';
import React from 'react'




const DashBoard = async () => {
  redirect('/punch');

  return (
    <div>DashBoard</div>
  )
}

export default DashBoard

