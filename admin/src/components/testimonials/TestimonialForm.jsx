import React from 'react';
import { Upload, Loader2, User } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Select from '@/components/ui/Select.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Alert from '@/components/ui/Alert.jsx';
import { listAdminRegions } from '@/lib/api/regionsApi';

const FALLBACK_REGIONS = ['Kerala', 'India', 'World'];

const emptyForm = () => ({
  name: '',
  role: '',
  quote: '',
  region: '',
  isActive: true,
  sortOrder: 0,
});

const TestimonialForm = ({
  initialTestimonial,
  isSaving,
  errorMessage,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = React.useState(emptyForm);
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);
  const [removeImage, setRemoveImage] = React.useState(false);
  const [regions, setRegions] = React.useState(FALLBACK_REGIONS);

  React.useEffect(() => {
    let cancelled = false;

    listAdminRegions()
      .then((response) => {
        if (cancelled) return;
        const nextRegions = (response.data || [])
          .map((entry) => entry.region)
          .filter(Boolean);
        if (nextRegions.length > 0) {
          setRegions(nextRegions);
        }
      })
      .catch(() => {
        setRegions(FALLBACK_REGIONS);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (initialTestimonial) {
      setForm({
        name: initialTestimonial.name || '',
        role: initialTestimonial.role || '',
        quote: initialTestimonial.quote || '',
        region: initialTestimonial.region || '',
        isActive: initialTestimonial.isActive !== false,
        sortOrder: initialTestimonial.sortOrder ?? 0,
      });
      setImagePreviewUrl(initialTestimonial.imageUrl || '');
    } else {
      setForm(emptyForm());
      setImagePreviewUrl('');
    }
    setImageFile(null);
    setRemoveImage(false);
    setImageBroken(false);
  }, [initialTestimonial]);

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
    setRemoveImage(Boolean(initialTestimonial?.imageUrl));
  };

  const resetPhoto = () => {
    setImageFile(null);
    setRemoveImage(false);
    setImagePreviewUrl(initialTestimonial?.imageUrl || '');
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
                alt={form.name || 'Testimonial photo'}
                className="h-24 w-24 rounded-full object-cover shrink-0"
                onError={() => setImageBroken(true)}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-slate-100 grid place-items-center text-ink-subtle shrink-0">
                <User size={28} />
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
                      setImagePreviewUrl(initialTestimonial?.imageUrl || '');
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
                Square images work best. Shown as a circular avatar on the site.
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
            placeholder="Anand"
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role / tagline</Label>
          <Input
            id="role"
            name="role"
            value={form.role}
            onChange={handleField}
            placeholder="Family Traveler"
          />
        </div>
        <div>
          <Label htmlFor="region">Show in region</Label>
          <Select id="region" name="region" value={form.region} onChange={handleField}>
            <option value="">All regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
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
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          name="quote"
          value={form.quote}
          onChange={handleField}
          placeholder="What the traveler said about their trip"
          rows={4}
          required
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
          {isSaving
            ? 'Saving…'
            : initialTestimonial
              ? 'Update testimonial'
              : 'Create testimonial'}
        </Button>
      </div>
    </form>
  );
};

export default TestimonialForm;
