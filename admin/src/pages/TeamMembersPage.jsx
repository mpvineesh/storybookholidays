import React from 'react';
import { Plus, Pencil, Trash2, Save, Loader2 } from 'lucide-react';
import Badge from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Drawer from '@/components/ui/Drawer.jsx';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import Alert from '@/components/ui/Alert.jsx';
import Thumbnail from '@/components/ui/Thumbnail.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import TeamMemberForm from '@/components/team/TeamMemberForm.jsx';
import {
  createTeamMember,
  deleteTeamMember,
  listTeamMembers,
  updateTeamMember,
} from '@/lib/api/teamMembersApi';
import { getAboutContent, updateAboutContent } from '@/lib/api/aboutContentApi';

const DEFAULT_HEADING = {
  kicker: 'Meet the team',
  title: 'The people behind your journey.',
  description:
    'With years of combined experience in travel, hospitality and destination management, our team is committed to delivering exceptional journeys across Kerala and beyond.',
};

const TeamMembersPage = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const [heading, setHeading] = React.useState(DEFAULT_HEADING);
  const [isSavingHeading, setIsSavingHeading] = React.useState(false);

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
      const response = await listTeamMembers();
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
    let cancelled = false;
    getAboutContent()
      .then((response) => {
        if (cancelled) return;
        const team = response.data?.team || {};
        setHeading({
          kicker: team.kicker ?? DEFAULT_HEADING.kicker,
          title: team.title ?? DEFAULT_HEADING.title,
          description: team.description ?? DEFAULT_HEADING.description,
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

  const handleHeadingField = (event) => {
    const { name, value } = event.target;
    setHeading((current) => ({ ...current, [name]: value }));
  };

  const handleSaveHeading = async (event) => {
    event.preventDefault();
    setIsSavingHeading(true);
    setErrorMessage('');
    try {
      await updateAboutContent({ team: heading });
      setSuccessMessage('Team section heading saved.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSavingHeading(false);
    }
  };

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

  const handleSubmit = async (form, imageFile, removeImage) => {
    setIsSaving(true);
    setFormError('');
    try {
      if (editing?._id) {
        await updateTeamMember(editing._id, form, imageFile, removeImage);
        setSuccessMessage('Team member updated.');
      } else {
        await createTeamMember(form, imageFile);
        setSuccessMessage('Team member added.');
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
      await deleteTeamMember(confirmTarget._id);
      setSuccessMessage('Team member removed.');
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
          <h2 className="text-xl font-semibold text-ink">Team</h2>
          <p className="text-sm text-ink-muted mt-1">
            People shown in the “Meet the team” section on the Our Story page.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          Add member
        </Button>
      </div>

      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      <Card>
        <CardBody>
          <form onSubmit={handleSaveHeading} className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-ink">Section heading</h3>
              <p className="text-sm text-ink-muted">
                The kicker, title and intro shown above the team photos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="team-kicker">Kicker</Label>
                <Input
                  id="team-kicker"
                  name="kicker"
                  value={heading.kicker}
                  onChange={handleHeadingField}
                  placeholder="Meet the team"
                />
              </div>
              <div>
                <Label htmlFor="team-title">Title</Label>
                <Input
                  id="team-title"
                  name="title"
                  value={heading.title}
                  onChange={handleHeadingField}
                  placeholder="Meet the team behind your journey"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="team-description">Intro</Label>
              <Textarea
                id="team-description"
                name="description"
                value={heading.description}
                onChange={handleHeadingField}
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingHeading}>
                {isSavingHeading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSavingHeading ? 'Saving…' : 'Save heading'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <div className="border-b border-border px-4 py-3 flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-semibold text-ink">Members</h3>
            <span className="text-sm text-ink-muted">
              {isLoading ? 'Loading…' : `${items.length} total`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-page text-ink-muted">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Member</th>
                  <th className="text-left px-4 py-2 font-medium">Designation</th>
                  <th className="text-left px-4 py-2 font-medium">Order</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
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
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-ink-muted">
                      No team members yet. Click “Add member” to create the first one.
                    </td>
                  </tr>
                ) : (
                  items.map((entry) => (
                    <tr key={entry._id} className="border-t border-border hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Thumbnail
                            src={entry.imageUrl}
                            alt={entry.name}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium text-ink leading-tight">{entry.name}</p>
                            {entry.bio ? (
                              <p className="text-xs text-ink-subtle line-clamp-1">{entry.bio}</p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{entry.role || '—'}</td>
                      <td className="px-4 py-3 text-ink-muted">{entry.sortOrder ?? 0}</td>
                      <td className="px-4 py-3">
                        <Badge tone={entry.isActive ? 'success' : 'warning'}>
                          {entry.isActive ? 'Live' : 'Hidden'}
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
        title={editing ? 'Edit team member' : 'Add team member'}
        description={editing ? `Updating "${editing.name}"` : 'Add a person with a photo and designation.'}
      >
        <TeamMemberForm
          initialMember={editing}
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
        title="Remove this team member?"
        description={
          confirmTarget
            ? `“${confirmTarget.name}” will be permanently removed from the team section. This cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TeamMembersPage;
