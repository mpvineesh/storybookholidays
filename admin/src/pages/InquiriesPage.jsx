import React from 'react';
import { Trash2, Search, Mail, Phone } from 'lucide-react';
import Badge from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Select from '@/components/ui/Select.jsx';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import Alert from '@/components/ui/Alert.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import {
  INQUIRY_REGIONS,
  INQUIRY_STATUSES,
  deleteInquiry,
  listInquiries,
  updateInquiry,
} from '@/lib/api/inquiriesApi';

const regionTone = {
  Kerala: 'success',
  India: 'brand',
  World: 'rose',
};

const statusTone = {
  new: 'warning',
  contacted: 'brand',
  closed: 'default',
};

const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const formatArrivalDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatFullName = (entry) => (entry.name || '').trim() || 'Unnamed';

const InquiriesPage = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const [search, setSearch] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('All');
  const [statusFilter, setStatusFilter] = React.useState('All');

  const [confirmTarget, setConfirmTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState(null);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await listInquiries();
      setItems(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((entry) => {
      if (regionFilter !== 'All' && entry.region !== regionFilter) return false;
      if (statusFilter !== 'All' && entry.status !== statusFilter) return false;
      if (!query) return true;
      return [entry.name, entry.email, entry.phone, entry.accommodationType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [items, search, regionFilter, statusFilter]);

  const handleStatusChange = async (entry, nextStatus) => {
    if (entry.status === nextStatus) return;
    setUpdatingId(entry._id);
    setErrorMessage('');
    try {
      const response = await updateInquiry(entry._id, { status: nextStatus });
      setItems((current) =>
        current.map((item) =>
          item._id === entry._id ? response.data : item
        )
      );
      setSuccessMessage('Inquiry status updated.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setIsDeleting(true);
    try {
      await deleteInquiry(confirmTarget._id);
      setSuccessMessage('Inquiry deleted.');
      setItems((current) =>
        current.filter((item) => item._id !== confirmTarget._id)
      );
      setConfirmTarget(null);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = React.useMemo(() => {
    const totals = { all: items.length, new: 0, contacted: 0, closed: 0 };
    items.forEach((entry) => {
      if (totals[entry.status] !== undefined) totals[entry.status] += 1;
    });
    return totals;
  }, [items]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Inquiries</h2>
          <p className="text-sm text-ink-muted mt-1">
            Holiday plan enquiries submitted from the contact page.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <Badge tone="warning">New: {counts.new}</Badge>
          <Badge tone="brand">Contacted: {counts.contacted}</Badge>
          <Badge tone="default">Closed: {counts.closed}</Badge>
        </div>
      </div>

      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      <Card>
        <CardBody className="p-0">
          <div className="border-b border-border px-4 py-3 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <Input
                placeholder="Search by name, email, phone…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-auto"
              aria-label="Filter inquiries by region"
            >
              <option value="All">All regions</option>
              {INQUIRY_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-auto"
              aria-label="Filter inquiries by status"
            >
              <option value="All">All statuses</option>
              {INQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Select>
            <span className="text-sm text-ink-muted">
              {isLoading ? 'Loading…' : `${filtered.length} of ${items.length}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-page text-ink-muted">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Lead</th>
                  <th className="text-left px-4 py-2 font-medium">Contact</th>
                  <th className="text-left px-4 py-2 font-medium">Trip</th>
                  <th className="text-left px-4 py-2 font-medium">Region</th>
                  <th className="text-left px-4 py-2 font-medium">Submitted</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-right px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-ink-muted">
                      {search.trim() || regionFilter !== 'All' || statusFilter !== 'All'
                        ? 'No inquiries match your filters.'
                        : 'No inquiries yet.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry) => (
                    <tr key={entry._id} className="border-t border-border hover:bg-slate-50/60 align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink leading-tight">
                          {formatFullName(entry)}
                        </p>
                        <p className="text-xs text-ink-subtle mt-0.5">
                          {entry.isHoneymoon ? 'Honeymoon enquiry' : 'Holiday enquiry'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-ink-subtle" />
                          <a
                            className="hover:text-brand-700"
                            href={`mailto:${entry.email}`}
                          >
                            {entry.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Phone size={12} className="text-ink-subtle" />
                          <a
                            className="hover:text-brand-700"
                            href={`tel:${entry.phone}`}
                          >
                            {entry.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        <p>
                          <span className="text-ink-subtle">Arrival:</span>{' '}
                          {formatArrivalDate(entry.arrivalDate)}
                        </p>
                        <p className="mt-0.5">
                          <span className="text-ink-subtle">Nights:</span>{' '}
                          {entry.numberOfNights ?? '—'}
                        </p>
                        {entry.accommodationType ? (
                          <p className="mt-0.5">
                            <span className="text-ink-subtle">Stay:</span>{' '}
                            {entry.accommodationType}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={regionTone[entry.region] || 'default'}>
                          {entry.region || 'Kerala'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-muted text-xs">
                        {formatDateTime(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge tone={statusTone[entry.status] || 'default'}>
                            {entry.status}
                          </Badge>
                          <Select
                            value={entry.status}
                            onChange={(event) =>
                              handleStatusChange(entry, event.target.value)
                            }
                            disabled={updatingId === entry._id}
                            className="w-auto"
                            aria-label={`Change status for ${formatFullName(entry)}`}
                          >
                            {INQUIRY_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50"
                            onClick={() => setConfirmTarget(entry)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Delete inquiry"
        description={
          confirmTarget
            ? `Permanently delete the enquiry from ${formatFullName(confirmTarget)}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default InquiriesPage;
