import React from 'react';
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Select from '@/components/ui/Select.jsx';
import Drawer from '@/components/ui/Drawer.jsx';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import Alert from '@/components/ui/Alert.jsx';
import Thumbnail from '@/components/ui/Thumbnail.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import HotelForm from '@/components/hotels/HotelForm.jsx';
import {
  HOTEL_REGIONS,
  HOTEL_TYPES,
  createHotel,
  deleteHotel,
  listHotels,
  updateHotel,
} from '@/lib/api/hotelsApi';

const regionTone = {
  Kerala: 'success',
  India: 'brand',
  World: 'rose',
};

const HotelsPage = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [regionFilter, setRegionFilter] = React.useState('All');
  const [typeFilter, setTypeFilter] = React.useState('All');

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const [confirmTarget, setConfirmTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await listHotels();
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
      if (regionFilter !== 'All' && (entry.region || 'Kerala') !== regionFilter) {
        return false;
      }
      if (typeFilter !== 'All' && (entry.type || 'Hotel') !== typeFilter) {
        return false;
      }
      if (!query) return true;
      return [entry.name, entry.slug, entry.location, entry.shortDescription]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [items, search, regionFilter, typeFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setDrawerOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setFormError('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (isSaving) return;
    setDrawerOpen(false);
    setEditing(null);
    setFormError('');
  };

  const handleSubmit = async (form, files) => {
    setIsSaving(true);
    setFormError('');
    try {
      if (editing?._id) {
        await updateHotel(editing._id, form, files);
        setSuccessMessage('Property updated.');
      } else {
        await createHotel(form, files);
        setSuccessMessage('Property created.');
      }
      await load();
      setDrawerOpen(false);
      setEditing(null);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setIsDeleting(true);
    try {
      await deleteHotel(confirmTarget._id);
      setSuccessMessage('Property deleted.');
      setConfirmTarget(null);
      await load();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Hotels &amp; Resorts</h2>
          <p className="text-sm text-ink-muted mt-1">
            Manage the properties that will appear on the Hotels &amp; Resorts page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add property
        </Button>
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
                placeholder="Search by name, slug, location…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-auto"
              aria-label="Filter by region"
            >
              <option value="All">All regions</option>
              {HOTEL_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-auto"
              aria-label="Filter by type"
            >
              <option value="All">All types</option>
              {HOTEL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
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
                  <th className="text-left px-4 py-2 font-medium">Property</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Region</th>
                  <th className="text-left px-4 py-2 font-medium">Rating</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-right px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-muted">
                      {search.trim() || regionFilter !== 'All' || typeFilter !== 'All'
                        ? 'No properties match your filters.'
                        : 'No properties yet. Click “Add property” to create the first one.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry) => (
                    <tr key={entry._id} className="border-t border-border hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail src={entry.imageUrl} alt={entry.name} />
                          <div>
                            <p className="font-medium text-ink leading-tight">{entry.name}</p>
                            <p className="text-xs text-ink-subtle line-clamp-1">
                              {entry.location || entry.shortDescription || 'No location set'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{entry.type || 'Hotel'}</td>
                      <td className="px-4 py-3">
                        <Badge tone={regionTone[entry.region] || 'default'}>
                          {entry.region || 'Kerala'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {entry.starRating ? (
                          <span className="inline-flex items-center gap-1">
                            <Star size={14} className="text-amber-500" />
                            {entry.starRating}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={entry.isActive === false ? 'warning' : 'success'}>
                          {entry.isActive === false ? 'Hidden' : 'Visible'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(entry)}
                          >
                            <Pencil size={14} />
                            Edit
                          </Button>
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

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editing ? 'Edit property' : 'Add property'}
        description={
          editing ? `Updating "${editing.name}"` : 'Add a hotel, resort, homestay, or houseboat.'
        }
      >
        <HotelForm
          initialHotel={editing}
          isSaving={isSaving}
          errorMessage={formError}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
        />
      </Drawer>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onCancel={() => (isDeleting ? null : setConfirmTarget(null))}
        onConfirm={handleConfirmDelete}
        title="Delete this property?"
        description={
          confirmTarget
            ? `“${confirmTarget.name}” and its images will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default HotelsPage;
