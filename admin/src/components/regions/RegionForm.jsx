import React from 'react';
import { Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import Alert from '@/components/ui/Alert.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';

const emptyForm = () => ({
  title: '',
  region: '',
  slug: '',
  tagline: '',
  description: '',
  imageUrl: '',
  isActive: true,
  sortOrder: 0,
});

const RegionForm = ({
  initialRegion,
  isSaving,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = React.useState(emptyForm);
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);

  React.useEffect(() => {
    if (initialRegion) {
      setForm({
        title: initialRegion.title || '',
        region: initialRegion.region || '',
        slug: initialRegion.slug || '',
        tagline: initialRegion.tagline || '',
        description: initialRegion.description || '',
        isActive: initialRegion.isActive !== false,
        sortOrder: initialRegion.sortOrder || 0,
      });
      setImagePreviewUrl(initialRegion.imageUrl || '');
      setImageFile(null);
    } else {
      setForm(emptyForm());
      setImagePreviewUrl('');
      setImageFile(null);
    }
    setImageBroken(false);
  }, [initialRegion]);

  React.useEffect(() => {
    if (!imageFile) return undefined;
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    setImageBroken(false);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleField = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form, imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleField}
            placeholder="Kerala"
            required
          />
        </div>
        <div>
          <Label htmlFor="region">Region key</Label>
          <Input
            id="region"
            name="region"
            value={form.region}
            onChange={handleField}
            placeholder="Kerala"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleField}
            placeholder="kerala"
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
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          name="tagline"
          value={form.tagline}
          onChange={handleField}
          placeholder="God's Own Country"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleField}
          placeholder="Short card description shown on the landing page."
        />
      </div>

      <div>
        <Label>Image</Label>
        <div className="rounded-lg border border-dashed border-border bg-bg-page p-4">
          {imagePreviewUrl && !imageBroken ? (
            <img
              src={imagePreviewUrl}
              alt={form.title || 'Region preview'}
              className="mb-3 h-40 w-full rounded-md object-cover"
              onError={() => setImageBroken(true)}
            />
          ) : imagePreviewUrl && imageBroken ? (
            <div className="mb-3 h-40 w-full rounded-md bg-slate-100 grid place-items-center text-ink-subtle">
              <div className="text-center">
                <ImageIcon size={24} className="mx-auto" />
                <p className="mt-1 text-xs">Existing image is unavailable. Upload a new one.</p>
              </div>
            </div>
          ) : null}

          <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-white px-3 h-9 text-sm text-ink hover:bg-slate-50">
            <Upload size={16} />
            <span>{imageFile ? imageFile.name : 'Choose new image'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                setImageFile(file);
                if (!file && initialRegion?.imageUrl) {
                  setImagePreviewUrl(initialRegion.imageUrl);
                } else if (!file) {
                  setImagePreviewUrl('');
                }
              }}
            />
          </label>
          {imageFile ? (
            <button
              type="button"
              className="ml-3 text-sm text-ink-muted hover:text-ink"
              onClick={() => {
                setImageFile(null);
                setImagePreviewUrl(initialRegion?.imageUrl || '');
              }}
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleField}
          className="h-4 w-4 rounded border-border text-brand-600"
        />
        Show this region on the public landing page
      </label>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSaving ? 'Saving...' : initialRegion ? 'Update region' : 'Create region'}
        </Button>
      </div>
    </form>
  );
};

export default RegionForm;
