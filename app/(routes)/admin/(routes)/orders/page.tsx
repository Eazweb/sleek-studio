import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import React from 'react'

 const page = async() => {
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
    <div>page</div>
  )
}

export default page