import React from 'react'
import { requireAdmin } from '@/lib/auth-utils'
import OopsMessage from '@/components/Others/OopsMessage'

export default async function CouponsPage() {
  const { isAuthorized, user, errorMessage } = await requireAdmin();
  
  // If not authorized, show the OopsMessage
  if (!isAuthorized) {
    return errorMessage ? (
      <OopsMessage 
        message={errorMessage.message}
        title={errorMessage.title}
        backUrl={errorMessage.backUrl}
        backText={errorMessage.backText}
      />
    ) : null;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coupons Management</h1>
      <div className="bg-slate-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Admin Info</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Name: {user.name || 'Not set'}</p>
      </div>
      
      {/* Coupon management interface will go here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">All Coupons</h2>
        <p>Coupon management functionality coming soon...</p>
      </div>
    </div>
  )
}
