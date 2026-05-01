import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const Topbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-white/80 backdrop-blur">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden rounded-md p-2 text-ink-muted hover:bg-slate-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold text-ink">Admin Console</h1>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-ink leading-tight">
                  {user.username || 'Admin'}
                </p>
                <p className="text-xs text-ink-subtle">Signed in</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-sm font-semibold">
                {(user.username || 'A').slice(0, 1).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-md p-2 text-ink-muted hover:bg-slate-100"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
