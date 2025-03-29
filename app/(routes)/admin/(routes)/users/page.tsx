import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import React from 'react'
import { columns } from './columns';
import { UserDataTable } from './components/user-table';
import { fetchUsers } from '@/actions/users';

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const { isAuthorized, errorMessage } = await requireAdmin();
  
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

  // Await searchParams before using its properties
  const params = await searchParams;

  // Parse search params
  const page = parseInt(params.page || '1');
  const pageSize = parseInt(params.pageSize || '10');
  const search = params.search || '';
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc';

  // Fetch users data using server action
  const { users, pagination } = await fetchUsers({
    page,
    pageSize,
    search,
    sortBy,
    sortOrder
  });
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Users Management</h1>
        <p className="text-muted-foreground">
          View and manage all users in the system.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <UserDataTable
          columns={columns}
          data={users}
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          totalPages={pagination.totalPages}
        />
      </div>
    </div>
  )
}