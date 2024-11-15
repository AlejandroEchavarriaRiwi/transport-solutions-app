'use client';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import React from 'react';
import Avatar from "@mui/material/Avatar";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function DashboardAsideNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white h-screen ml-3">
      <h1 className="text-2xl font-bold mt-5">Transport Solutions</h1>
      <div>
      <Avatar
          alt="User Photo"
          src={"/avatar/user.jpg"}
          sx={{ width: 44, height: 44 }}
        />
        <h1>{session?.user.name}</h1>
      </div>
      <nav className="flex flex-col mt-12">
        <Link
          href="/dashboard/management"
          className={clsx(
            'flex gap-3 p-2',
            pathname === '/dashboard/projects' && 'bg-gray-300'
          )}
        >
           Vehicles
        </Link>
        <a
          className="flex gap-3 p-2 cursor-pointer"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
           Log out
        </a>
      </nav>
    </aside>
  );
}