import OopsMessage from '@/components/Others/OopsMessage';
import { requireAdmin } from '@/lib/auth-utils';
import { getUserById } from '@/actions/users';
import { notFound } from 'next/navigation';
import { UserRoleToggle } from './components/user-role-toggle';
import { DeleteUserButton } from './components/delete-user-button';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Use the Next.js 15 pattern for dynamic page params
type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
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

  // Await params before using them
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  // Fetch user data
  const user = await getUserById(userId);
  
  if (!user) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">User Details</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage user information.
          </p>
        </div>
        <DeleteUserButton userId={user.id} userName={user.name || user.email} />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Name:</span>
                  <span>{user.name || "No name"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Joined:</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Role Management */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Role Management</h2>
              <UserRoleToggle userId={user.id} currentRole={user.role} />
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Addresses</h2>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="font-medium">{address.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {address.addressLine1}, {address.city}, {address.state} {address.postalCode}
                    </div>
                    <div className="text-sm text-muted-foreground">{address.country}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No addresses found</p>
            )}
          </div>

          {/* Recent Orders */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
            {user.orders && user.orders.length > 0 ? (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No orders found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 