import React from 'react';
import { Briefcase, MapPin, Globe } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card.jsx';

const stats = [
  { label: 'Packages', value: '—', icon: Briefcase, tone: 'bg-indigo-50 text-indigo-700' },
  { label: 'Destinations', value: '—', icon: MapPin, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Regions configured', value: '3', icon: Globe, tone: 'bg-rose-50 text-rose-700' },
];

const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-ink">Welcome back</h2>
      <p className="text-sm text-ink-muted mt-1">
        Quick overview of your content. Detailed pages are coming in the next
        phase.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <Card key={label}>
          <CardBody className="p-5 pt-5 flex items-center gap-4">
            <div className={`h-11 w-11 rounded-lg grid place-items-center ${tone}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-subtle">
                {label}
              </p>
              <p className="text-2xl font-semibold text-ink mt-0.5">{value}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>

    <Card>
      <CardBody>
        <h3 className="text-base font-semibold text-ink">What’s next</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-muted list-disc pl-5">
          <li>Phase (b) — Packages CRUD page with search and image upload.</li>
          <li>Phase (c) — Destinations, Itineraries, Region Content editors.</li>
        </ul>
      </CardBody>
    </Card>
  </div>
);

export default DashboardPage;
