import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MapPin,
  Globe,
  PlaneTakeoff,
  X,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/packages', label: 'Packages', icon: Briefcase },
  { to: '/destinations', label: 'Destinations', icon: MapPin },
  { to: '/itineraries', label: 'Itineraries', icon: PlaneTakeoff },
  { to: '/region-content', label: 'Region Content', icon: Globe },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {/* Mobile overlay */}
    {open ? (
      <div
        className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
    ) : null}

    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform bg-bg-base text-ink-inverse',
        'transition-transform duration-200 ease-out',
        'lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center justify-between px-5 border-b border-border-dark">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600 grid place-items-center text-sm font-bold">
            SB
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Story Book</p>
            <p className="text-xs text-slate-400 mt-1">Admin</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden rounded-md p-1.5 text-slate-300 hover:bg-bg-subtle"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:bg-bg-subtle hover:text-white'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default Sidebar;
