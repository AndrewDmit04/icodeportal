import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (  
    <div className='flex h-screen w-100 justify-center items-center'>
        <SignUp />
    </div>
    )   
  
}