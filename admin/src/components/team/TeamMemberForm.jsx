import React from 'react';
import { Upload, Loader2, User } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Alert from '@/components/ui/Alert.jsx';

const emptyForm = () => ({
  name: '',
  role: '',
  bio: '',
  isActive: true,
  sortOrder: 0,
});

const TeamMemberForm = ({ initialMember, isSaving, errorMessage, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState(emptyForm);
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);
  const [removeImage, setRemoveImage] = React.useState(false);

  React.useEffect(() => {
    if (initialMember) {
      setForm({
        name: initialMember.name || '',
        role: initialMember.role || '',
        bio: initialMember.bio || '',
        isActive: initialMember.isActive !== false,
        sortOrder: initialMember.sortOrder ?? 0,
      });
      setImagePreviewUrl(initialMember.imageUrl || '');
    } else {
      setForm(emptyForm());
      setImagePreviewUrl('');
    }
    setImageFile(null);
    setRemoveImage(false);
    setImageBroken(false);
  }, [initialMember]);

  React.useEffect(() => {
    if (!imageFile) return undefined;
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    setImageBroken(false);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form, imageFile, removeImage);
  };

  const clearPhoto = () => {
    setImageFile(null);
    setImagePreviewUrl('');
    setRemoveImage(Boolean(initialMember?.imageUrl));
  };

  const resetPhoto = () => {
    setImageFile(null);
    setRemoveImage(false);
    setImagePreviewUrl(initialMember?.imageUrl || '');
  };

  const showPreview = imagePreviewUrl && !imageBroken;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}

      <div>
        <Label>Photo</Label>
        <div className="rounded-lg border border-dashed border-border bg-bg-page p-4">
          <div className="flex items-center gap-4">
            {showPreview ? (
              <img
                src={imagePreviewUrl}
                alt={form.name || 'Team member photo'}
                className="h-28 w-28 rounded-full object-cover shrink-0"
                onError={() => setImageBroken(true)}
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-slate-100 grid place-items-center text-ink-subtle shrink-0">
                <User size={32} />
              </div>
            )}
            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-white px-3 h-9 text-sm text-ink hover:bg-slate-50">
                <Upload size={16} />
                <span>{imageFile ? imageFile.name : 'Choose photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setImageFile(file);
                    setRemoveImage(false);
                    if (!file) {
                      setImagePreviewUrl(initialMember?.imageUrl || '');
                    }
                  }}
                />
              </label>
              <div className="flex items-center gap-3 text-sm">
                {imagePreviewUrl && !removeImage ? (
                  <button
                    type="button"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={clearPhoto}
                  >
                    Remove photo
                  </button>
                ) : null}
                {imageFile || removeImage ? (
                  <button
                    type="button"
                    className="text-ink-muted hover:text-ink"
                    onClick={resetPhoto}
                  >
                    Reset
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-ink-subtle">
                Square portrait works best. Shown as a large circular photo on the site.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleField}
            placeholder="Justin Jose"
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Designation</Label>
          <Input
            id="role"
            name="role"
            value={form.role}
            onChange={handleField}
            placeholder="Founder & Director"
          />
        </div>
        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            value={form.sortOrder}
            onChange={handleField}
            placeholder="0"
          />
          <p className="mt-1 text-xs text-ink-subtle">Lower numbers appear first.</p>
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Short bio (optional)</Label>
        <Textarea
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleField}
          placeholder="One or two lines about this person"
          rows={3}
        />
      </div>

      <label className="inline-flex items-center gap-2 text-sm text-ink cursor-pointer">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleField}
          className="h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500"
        />
        Show on the website
      </label>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSaving ? 'Saving…' : initialMember ? 'Update member' : 'Add member'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
