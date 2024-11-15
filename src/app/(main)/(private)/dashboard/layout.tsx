import React from 'react';
import AuthGuard from './guard/AuthGuard';
import DashboardAsideNavbar from '@/ui/organisms/common/NavBarDashboardAside';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className='flex'>
        <DashboardAsideNavbar />
        {children}
      </div>
    </AuthGuard>
  );
}