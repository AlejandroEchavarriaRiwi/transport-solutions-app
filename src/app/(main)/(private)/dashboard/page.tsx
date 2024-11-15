'use client';
import { signOut } from 'next-auth/react';
import React from 'react'

export default function WelcomeDashboard() {
  return (
    <div>    
      <div>Welcome Dashboard</div>
    <button onClick={() => signOut({ callbackUrl: '/login' })}>Logout</button>
    </div>

  )
}
