import React from 'react';
import { Upload, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Select from '@/components/ui/Select.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import RichTextEditor from '@/components/ui/RichTextEditor.jsx';
import Alert from '@/components/ui/Alert.jsx';
import { HOTEL_REGIONS, HOTEL_TYPES } from '@/lib/api/hotelsApi';
import { listAdminRegions } from '@/lib/api/regionsApi';

const emptyForm = () => ({
  name: '',
  slug: '',
  type: 'Hotel',
  region: 'Kerala',
  location: '',
  address: '',
  starRating: 0,
  shortDescription: '',
  contentHtml: '',
  amenities: [],
  priceFrom: '',
  priceNote: '',
  contactPhone: '',
  contactEmail: '',
  website: '',
  mapUrl: '',
  isActive: true,
  sortOrder: 0,
});

const formFromHotel = (hotel) => ({
  name: hotel.name || '',
  slug: hotel.slug || '',
  type: hotel.type || 'Hotel',
  region: hotel.region || 'Kerala',
  location: hotel.location || '',
  address: hotel.address || '',
  starRating: hotel.starRating || 0,
  shortDescription: hotel.shortDescription || '',
  contentHtml: hotel.contentHtml || '',
  amenities: hotel.amenities || [],
  priceFrom: hotel.priceFrom || '',
  priceNote: hotel.priceNote || '',
  contactPhone: hotel.contactPhone || '',
  contactEmail: hotel.contactEmail || '',
  website: hotel.website || '',
  mapUrl: hotel.mapUrl || '',
  isActive: hotel.isActive !== false,
  sortOrder: hotel.sortOrder || 0,
});

const HotelForm = ({ initialHotel, isSaving, errorMessage, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState(emptyForm);
  const [regions, setRegions] = React.useState(HOTEL_REGIONS);

  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);

  // Existing gallery entries still kept, plus newly chosen files.
  const [existingGallery, setExistingGallery] = React.useState([]);
  const [galleryFiles, setGalleryFiles] = React.useState([]);
  const [galleryPreviews, setGalleryPreviews] = React.useState([]);

  const [amenityDraft, setAmenityDraft] = React.useState('');

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
        setRegions(HOTEL_REGIONS);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (initialHotel) {
      setForm(formFromHotel(initialHotel));
      setImagePreviewUrl(initialHotel.imageUrl || '');
      setExistingGallery(initialHotel.gallery || []);
    } else {
      setForm(emptyForm());
      setImagePreviewUrl('');
      setExistingGallery([]);
    }
    setImageFile(null);
    setGalleryFiles([]);
    setAmenityDraft('');
    setImageBroken(false);
  }, [initialHotel]);

  React.useEffect(() => {
    if (!imageFile) return undefined;
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    setImageBroken(false);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  React.useEffect(() => {
    const urls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [galleryFiles]);

  const handleField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addAmenity = () => {
    const next = amenityDraft.trim();
    if (!next) return;
    setForm((current) =>
      current.amenities.includes(next)
        ? current
        : { ...current, amenities: [...current.amenities, next] }
    );
    setAmenityDraft('');
  };

  const removeAmenity = (value) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.filter((entry) => entry !== value),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form, {
      imageFile,
      galleryFiles,
      keepGallery: existingGallery.map((entry) => entry.imagePath),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleField}
            placeholder="Kumarakom Lake Resort"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleField}
            placeholder="kumarakom-lake-resort"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" value={form.type} onChange={handleField} required>
            {HOTEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="region">Region</Label>
          <Select id="region" name="region" value={form.region} onChange={handleField} required>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={handleField}
            placeholder="Kumarakom, Kottayam"
          />
        </div>
        <div>
          <Label htmlFor="starRating">Star rating</Label>
          <Select id="starRating" name="starRating" value={form.starRating} onChange={handleField}>
            <option value={0}>Unrated</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} star{star > 1 ? 's' : ''}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={form.address}
          onChange={handleField}
          placeholder="Full postal address"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Textarea
          id="shortDescription"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleField}
          placeholder="Short teaser shown on listings"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="amenityDraft">Amenities</Label>
        <div className="flex items-center gap-2">
          <Input
            id="amenityDraft"
            value={amenityDraft}
            onChange={(event) => setAmenityDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addAmenity();
              }
            }}
            placeholder="Pool, Spa, Wi‑Fi… press Enter to add"
          />
          <Button type="button" variant="secondary" onClick={addAmenity}>
            <Plus size={16} />
            Add
          </Button>
        </div>
        {form.amenities.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
              >
                {amenity}
                <button
                  type="button"
                  className="text-slate-500 hover:text-slate-900"
                  onClick={() => removeAmenity(amenity)}
                  aria-label={`Remove ${amenity}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priceFrom">Price from (₹ per night)</Label>
          <Input
            id="priceFrom"
            name="priceFrom"
            type="number"
            min="0"
            value={form.priceFrom}
            onChange={handleField}
            placeholder="8500"
          />
        </div>
        <div>
          <Label htmlFor="priceNote">Price note</Label>
          <Input
            id="priceNote"
            name="priceNote"
            value={form.priceNote}
            onChange={handleField}
            placeholder="Includes breakfast, seasonal rates apply"
          />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleField}
            placeholder="+91 ..."
          />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={handleField}
            placeholder="reservations@example.com"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={form.website}
            onChange={handleField}
            placeholder="https://"
          />
        </div>
        <div>
          <Label htmlFor="mapUrl">Map link</Label>
          <Input
            id="mapUrl"
            name="mapUrl"
            value={form.mapUrl}
            onChange={handleField}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="rounded-lg border border-dashed border-border bg-bg-page p-4">
          {imagePreviewUrl && !imageBroken ? (
            <img
              src={imagePreviewUrl}
              alt={form.name || 'Hotel preview'}
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
                if (!file) {
                  setImagePreviewUrl(initialHotel?.imageUrl || '');
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
                setImagePreviewUrl(initialHotel?.imageUrl || '');
              }}
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <Label>Gallery</Label>
        <div className="rounded-lg border border-dashed border-border bg-bg-page p-4">
          {existingGallery.length > 0 || galleryPreviews.length > 0 ? (
            <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {existingGallery.map((entry) => (
                <div key={entry.imagePath} className="relative group">
                  <img
                    src={entry.imageUrl}
                    alt={entry.imageOriginalName || 'Gallery image'}
                    className="h-20 w-full rounded-md object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100"
                    onClick={() =>
                      setExistingGallery((current) =>
                        current.filter((item) => item.imagePath !== entry.imagePath)
                      )
                    }
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {galleryPreviews.map((url, index) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={galleryFiles[index]?.name || 'New gallery image'}
                    className="h-20 w-full rounded-md object-cover ring-2 ring-brand-500"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 group-hover:opacity-100"
                    onClick={() =>
                      setGalleryFiles((current) => current.filter((_, i) => i !== index))
                    }
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-white px-3 h-9 text-sm text-ink hover:bg-slate-50">
            <Upload size={16} />
            <span>Add gallery images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files || []);
                if (files.length > 0) {
                  setGalleryFiles((current) => [...current, ...files]);
                }
                event.target.value = '';
              }}
            />
          </label>
          <p className="mt-2 text-xs text-ink-subtle">Up to 12 images. New images are outlined.</p>
        </div>
      </div>

      <div>
        <Label>Property details</Label>
        <RichTextEditor
          value={form.contentHtml}
          onChange={(value) => setForm((current) => ({ ...current, contentHtml: value }))}
          placeholder="Rooms, dining, experiences, check-in details, policies, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
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
        <label className="inline-flex items-center gap-2 text-sm text-ink h-9">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleField}
            className="h-4 w-4 rounded border-border"
          />
          Visible on the website
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSaving ? 'Saving…' : initialHotel ? 'Update property' : 'Create property'}
        </Button>
      </div>
    </form>
  );
};

export default HotelForm;
