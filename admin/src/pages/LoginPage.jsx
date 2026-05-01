import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Alert from '@/components/ui/Alert.jsx';

const LoginPage = () => {
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');

  if (user) {
    const target = location.state?.from?.pathname || '/';
    return <Navigate to={target} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(form);
      const target = location.state?.from?.pathname || '/';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-bg-base p-10 text-ink-inverse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-600 grid place-items-center text-base font-bold">
            SB
          </div>
          <div>
            <p className="text-sm font-semibold">Story Book Holidays</p>
            <p className="text-xs text-slate-400">Admin Console</p>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Manage every region’s story from one place.
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Curate packages, destinations, and landing-page content for Kerala,
            India, and World — all from a single, focused workspace.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Story Book Holidays
        </p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-ink">Sign in</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Use your admin credentials to continue.
            </p>
          </div>

          {error ? <Alert tone="error" className="mb-4">{error}</Alert> : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                disabled={isSubmitting}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
