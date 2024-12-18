import { getAllInstructors } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const Staff = async() => {
    const user = await currentUser();
    if(!user){return}
    const currentStaff = await getAllInstructors({id : user.id});
    console.log(currentStaff)
    return (
    <div>
        <div>
            <h1>Current iCode staff</h1>
            {currentStaff.map((item)=>{
                return(
                    <div>
                        
                    </div>
                )
            })}
        </div>
        <div>
            <h1>Awating verification</h1>

        </div>
    </div>
  )
}

export default Staff