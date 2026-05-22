import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../../lib/authClient';

export default function ProtectedRoute({ allowedRoles }) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
