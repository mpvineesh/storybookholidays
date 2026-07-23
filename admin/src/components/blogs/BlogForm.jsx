import React from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import RichTextEditor from '@/components/ui/RichTextEditor.jsx';
import Alert from '@/components/ui/Alert.jsx';

const emptyForm = () => ({
  title: '',
  slug: '',
  author: '',
  excerpt: '',
  contentHtml: '',
  tags: '',
});

const BlogForm = ({ initialBlog, isSaving, errorMessage, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState(emptyForm);
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [imageBroken, setImageBroken] = React.useState(false);

  React.useEffect(() => {
    if (initialBlog) {
      setForm({
        title: initialBlog.title || '',
        slug: initialBlog.slug || '',
        author: initialBlog.author || '',
        excerpt: initialBlog.excerpt || '',
        contentHtml: initialBlog.contentHtml || '',
        tags: Array.isArray(initialBlog.tags) ? initialBlog.tags.join(', ') : '',
      });
      setImageFile(null);
      setImagePreviewUrl(initialBlog.imageUrl || '');
    } else {
      setForm(emptyForm());
      setImageFile(null);
      setImagePreviewUrl('');
    }
    setImageBroken(false);
  }, [initialBlog]);

  React.useEffect(() => {
    if (!imageFile) return undefined;
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    setImageBroken(false);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  React.useEffect(() => {
    setImageBroken(false);
  }, [imagePreviewUrl]);

  const handleField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
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
            placeholder="10 hidden gems in Kerala"
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
            placeholder="hidden-gems-in-kerala"
          />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            value={form.author}
            onChange={handleField}
            placeholder="Story Book Holidays"
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleField}
            placeholder="Kerala, Travel Tips (comma separated)"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={form.excerpt}
          onChange={handleField}
          placeholder="Short teaser shown on the blog listing"
          rows={3}
        />
      </div>

      <div>
        <Label>Cover image</Label>
        <div className="rounded-lg border border-dashed border-border bg-bg-page p-4">
          {imagePreviewUrl && !imageBroken ? (
            <img
              src={imagePreviewUrl}
              alt={form.title || 'Blog preview'}
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
                if (!file && initialBlog?.imageUrl) {
                  setImagePreviewUrl(initialBlog.imageUrl);
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
                setImagePreviewUrl(initialBlog?.imageUrl || '');
              }}
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <div>
        <Label>Blog content</Label>
        <RichTextEditor
          value={form.contentHtml}
          onChange={(value) =>
            setForm((current) => ({ ...current, contentHtml: value }))
          }
          placeholder="Write the full blog post here…"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSaving ? 'Saving…' : initialBlog ? 'Update blog' : 'Create blog'}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
