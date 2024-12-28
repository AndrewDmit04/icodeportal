'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';


export default function ProfileClient() { 
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  redirect("punch");
  return (
    user && (
      <div>

      </div>
    )
  );
}