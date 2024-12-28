'use client';

import { redirect } from 'next/navigation';


export default function ProfileClient() { 

  redirect("/punch");
  return null;
}