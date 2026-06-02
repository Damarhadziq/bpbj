import { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { signIn, useSession } from '../../lib/authClient';
import logoSemarang from '../../assets/logo-semarang.png';
import SEOHead from '../../components/SEOHead';
import { pageSEO } from '../../utils/seoConfig';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const sessionReason = new URLSearchParams(location.search).get('reason');
  const isSessionExpired = sessionReason === 'session-expired';
  const isSessionReplaced = sessionReason === 'session-replaced';

  const { data: session, isPending } = useSession();
  const [isTakingTooLong, setIsTakingTooLong] = useState(false);

  useEffect(() => {
    if (!isPending) return undefined;
    const timer = setTimeout(() => setIsTakingTooLong(true), 5000);
    return () => clearTimeout(timer);
  }, [isPending]);

  if (!isPending && session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockedUntil > Date.now()) {
      setError('Terlalu banyak percobaan gagal. Coba lagi beberapa saat.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const signInResult = await Promise.race([
        signIn.email({
          email: email.trim().toLowerCase(),
          password,
          rememberMe: false,
        }),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('LOGIN_TIMEOUT')), 10000);
        }),
      ]);

      const { error: signInError } = signInResult;

      if (signInError) {
        const nextFailedAttempts = failedAttempts + 1;
        setFailedAttempts(nextFailedAttempts);
        if (nextFailedAttempts >= 5) {
          setLockedUntil(Date.now() + 60_000);
          setFailedAttempts(0);
        }
        setError(signInError.message || 'Email atau password salah');
      } else {
        setFailedAttempts(0);
        navigate('/admin/dashboard');
      }
    } catch (loginError) {
      setError(loginError.message === 'LOGIN_TIMEOUT'
        ? 'Server login tidak merespons. Pastikan API lokal berjalan di port 4000 lalu coba lagi.'
        : 'Terjadi kesalahan jaringan');
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center font-['Inter']">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        <p className="mt-4 text-sm font-medium text-slate-700">Menyiapkan halaman login admin...</p>
        {isTakingTooLong && (
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Proses terlalu lama. Pastikan server API lokal berjalan di port 4000, lalu refresh halaman ini.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
      <SEOHead {...pageSEO.admin} path="/admin/login" noindex />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto object-contain drop-shadow-sm"
          src={logoSemarang}
          alt="Logo Kota Semarang"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-on-surface tracking-tight">
          Login Admin BPBJ
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant">
          Silakan masuk menggunakan kredensial Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg shadow-primary/5 sm:rounded-lg sm:px-10 border border-slate-200">
          <Link to="/" className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80">
            <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            Kembali ke Website BPBJ
          </Link>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}
            {isSessionExpired && !error && (
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm font-medium text-amber-700">
                Sesi admin berakhir karena tidak ada aktivitas. Silakan masuk kembali.
              </div>
            )}
            {isSessionReplaced && !error && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm font-medium text-blue-700">
                Sesi admin berakhir karena akun ini masuk dari device lain. Silakan masuk kembali jika ingin menggunakan device ini.
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-on-surface-variant mb-2">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-outline-variant rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="admin@semarangkota.go.id"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-on-surface-variant mb-2">
                Kata Sandi
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 pr-12 border border-outline-variant rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Password admin"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-primary"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || lockedUntil > Date.now()}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
