import React from 'react';
import { Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import { uploadRegionContentImage } from '@/lib/api/regionContentApi';

const HeroSlideEditor = ({ index, slide, onChange, onRemove }) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);

  React.useEffect(() => {
    setImageBroken(false);
  }, [slide.imageUrl]);

  const update = (key, value) => onChange({ ...slide, [key]: value });

  const handleHighlightsChange = (value) => {
    update(
      'highlights',
      value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
    );
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const response = await uploadRegionContentImage(file);
      const url = response.data?.url || response.data?.path || '';
      update('imageUrl', url);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-page p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Slide {index + 1}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-rose-600 hover:bg-rose-50"
          onClick={onRemove}
        >
          <Trash2 size={14} />
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Title</Label>
          <Input
            value={slide.title || ''}
            onChange={(event) => update('title', event.target.value)}
          />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input
            value={slide.subtitle || ''}
            onChange={(event) => update('subtitle', event.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          rows={2}
          value={slide.description || ''}
          onChange={(event) => update('description', event.target.value)}
        />
      </div>

      <div>
        <Label>Highlights (comma separated)</Label>
        <Input
          value={(slide.highlights || []).join(', ')}
          onChange={(event) => handleHighlightsChange(event.target.value)}
          placeholder="Tea estates, Waterfalls, Hill retreats"
        />
      </div>

      <div>
        <Label>Image</Label>
        <div className="rounded-lg border border-dashed border-border bg-white p-3">
          {slide.imageUrl && !imageBroken ? (
            <img
              src={slide.imageUrl}
              alt={slide.title || `Slide ${index + 1}`}
              className="mb-3 h-32 w-full rounded-md object-cover"
              onError={() => setImageBroken(true)}
            />
          ) : slide.imageUrl && imageBroken ? (
            <div className="mb-3 h-32 w-full rounded-md bg-slate-100 grid place-items-center text-ink-subtle">
              <ImageIcon size={20} />
            </div>
          ) : null}

          <div className="flex items-center gap-2 flex-wrap">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-white px-3 h-9 text-sm text-ink hover:bg-slate-50">
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              <span>{isUploading ? 'Uploading…' : 'Upload image'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
                disabled={isUploading}
              />
            </label>
            <Input
              value={slide.imageUrl || ''}
              onChange={(event) => update('imageUrl', event.target.value)}
              placeholder="…or paste a URL"
              className="flex-1 min-w-[200px]"
            />
          </div>
          {uploadError ? (
            <p className="mt-2 text-xs text-rose-600">{uploadError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HeroSlideEditor;
