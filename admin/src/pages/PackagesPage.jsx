import React from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Drawer from '@/components/ui/Drawer.jsx';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import Alert from '@/components/ui/Alert.jsx';
import Thumbnail from '@/components/ui/Thumbnail.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import PackageForm from '@/components/packages/PackageForm.jsx';
import {
  createPackage,
  deletePackage,
  listPackages,
  updatePackage,
} from '@/lib/api/packagesApi';

const regionTone = {
  Kerala: 'success',
  India: 'brand',
  World: 'rose',
};

const PackagesPage = () => {
  const [packages, setPackages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [search, setSearch] = React.useState('');

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editingPackage, setEditingPackage] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState('');

  const [confirmTarget, setConfirmTarget] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadPackages = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await listPackages();
      setPackages(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  React.useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const filteredPackages = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return packages;
    return packages.filter((entry) =>
      [entry.title, entry.slug, entry.shortDescription, entry.region]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [packages, search]);

  const openCreate = () => {
    setEditingPackage(null);
    setFormError('');
    setDrawerOpen(true);
  };

  const openEdit = (entry) => {
    setEditingPackage(entry);
    setFormError('');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    if (isSaving) return;
    setDrawerOpen(false);
    setEditingPackage(null);
    setFormError('');
  };

  const handleSubmit = async (form, imageFile) => {
    setIsSaving(true);
    setFormError('');
    try {
      if (editingPackage?._id) {
        await updatePackage(editingPackage._id, form, imageFile);
        setSuccessMessage('Package updated.');
      } else {
        await createPackage(form, imageFile);
        setSuccessMessage('Package created.');
      }
      await loadPackages();
      setDrawerOpen(false);
      setEditingPackage(null);
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
      await deletePackage(confirmTarget._id);
      setSuccessMessage('Package deleted.');
      setConfirmTarget(null);
      await loadPackages();
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
          <h2 className="text-xl font-semibold text-ink">Packages</h2>
          <p className="text-sm text-ink-muted mt-1">
            Manage curated holiday packages across all regions.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add package
        </Button>
      </div>

      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      <Card>
        <CardBody className="p-0">
          <div className="border-b border-border px-4 py-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <Input
                placeholder="Search by title, slug, region…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-sm text-ink-muted">
              {isLoading ? 'Loading…' : `${filteredPackages.length} of ${packages.length}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-page text-ink-muted">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Package</th>
                  <th className="text-left px-4 py-2 font-medium">Region</th>
                  <th className="text-left px-4 py-2 font-medium">Duration</th>
                  <th className="text-left px-4 py-2 font-medium">Slug</th>
                  <th className="text-right px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center">
                      <Spinner />
                    </td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-ink-muted">
                      {search.trim()
                        ? 'No packages match your search.'
                        : 'No packages yet. Click “Add package” to create the first one.'}
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((entry) => (
                    <tr key={entry._id} className="border-t border-border hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail src={entry.imageUrl} alt={entry.title} />
                          <div>
                            <p className="font-medium text-ink leading-tight">
                              {entry.title}
                            </p>
                            <p className="text-xs text-ink-subtle line-clamp-1">
                              {entry.shortDescription || 'No short description'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={regionTone[entry.region] || 'default'}>
                          {entry.region || '—'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {entry.duration || 'Flexible'}
                      </td>
                      <td className="px-4 py-3 text-ink-muted font-mono text-xs">
                        {entry.slug}
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
        title={editingPackage ? 'Edit package' : 'Create package'}
        description={
          editingPackage
            ? `Updating "${editingPackage.title}"`
            : 'Add a new package to your catalog.'
        }
      >
        <PackageForm
          initialPackage={editingPackage}
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
        title="Delete this package?"
        description={
          confirmTarget
            ? `“${confirmTarget.title}” will be permanently removed. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PackagesPage;
