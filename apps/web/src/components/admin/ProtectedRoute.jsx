import { useEffect, useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../../lib/authClient';

export default function ProtectedRoute({ allowedRoles }) {
  const { data: session, isPending } = useSession();
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  useEffect(() => {
    if (!isPending) {
      return undefined;
    }

    const timer = setTimeout(() => setIsTakingTooLong(true), 8000);
    return () => clearTimeout(timer);
  }, [isPending]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex max-w-sm flex-col items-center text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-sm font-medium text-slate-600">Memeriksa sesi admin...</p>
          {isTakingTooLong && (
            <>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Proses login terlalu lama. Biasanya ini terjadi kalau server API belum berjalan atau sesi browser sudah tidak valid.
              </p>
              <Link to="/admin/login" className="mt-4 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90">
                Kembali ke Login
              </Link>
            </>
          )}
        </div>
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
