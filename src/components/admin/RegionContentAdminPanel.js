import React from 'react';
import {
  getRegionContent,
  updateRegionContent,
  uploadRegionContentImage,
} from '../../services/regionContentApi';

const REGIONS = ['Kerala', 'India', 'World'];

const emptyContent = () => ({
  header: { tagline: '' },
  hero: {
    eyebrow: '',
    title: '',
    description: '',
    badges: [],
    slides: [],
  },
  planning: { points: [] },
  destinations: { kicker: '', title: '', items: [] },
  packagesSection: { kicker: '', title: '' },
  experience: { kicker: '', title: '', themes: [] },
  stats: [],
});

const emptySlide = () => ({
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  highlights: [],
});

const emptyStat = () => ({ value: '', label: '' });

function RegionContentAdminPanel({ token }) {
  const [activeRegion, setActiveRegion] = React.useState('Kerala');
  const [content, setContent] = React.useState(emptyContent);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [uploadingSlideIndex, setUploadingSlideIndex] = React.useState(null);

  const loadContent = React.useCallback(async (region) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await getRegionContent(region);
      setContent({ ...emptyContent(), ...(response.data || {}) });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadContent(activeRegion);
  }, [activeRegion, loadContent]);

  const updateField = (path, value) => {
    setContent((current) => {
      const next = { ...current };
      const segments = path.split('.');
      let node = next;
      for (let i = 0; i < segments.length - 1; i += 1) {
        const key = segments[i];
        node[key] = { ...(node[key] || {}) };
        node = node[key];
      }
      node[segments[segments.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await updateRegionContent(token, activeRegion, content);
      setContent({ ...emptyContent(), ...(response.data || {}) });
      setSuccessMessage('Region content saved.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSlide = (index, key, value) => {
    setContent((current) => {
      const slides = [...(current.hero?.slides || [])];
      slides[index] = { ...slides[index], [key]: value };
      return { ...current, hero: { ...current.hero, slides } };
    });
  };

  const addSlide = () => {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: [...(current.hero?.slides || []), emptySlide()],
      },
    }));
  };

  const removeSlide = (index) => {
    setContent((current) => {
      const slides = [...(current.hero?.slides || [])];
      slides.splice(index, 1);
      return { ...current, hero: { ...current.hero, slides } };
    });
  };

  const handleSlideImageUpload = async (index, file) => {
    if (!file) return;
    setUploadingSlideIndex(index);
    setErrorMessage('');
    try {
      const response = await uploadRegionContentImage(token, file);
      const url = (response.data && (response.data.path || response.data.url)) || '';
      updateSlide(index, 'imageUrl', url);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setUploadingSlideIndex(null);
    }
  };

  const updateStat = (index, key, value) => {
    setContent((current) => {
      const stats = [...(current.stats || [])];
      stats[index] = { ...stats[index], [key]: value };
      return { ...current, stats };
    });
  };

  const addStat = () => {
    setContent((current) => ({ ...current, stats: [...(current.stats || []), emptyStat()] }));
  };

  const removeStat = (index) => {
    setContent((current) => {
      const stats = [...(current.stats || [])];
      stats.splice(index, 1);
      return { ...current, stats };
    });
  };

  const heroBadgesText = (content.hero?.badges || []).join(', ');
  const slideHighlightsText = (slide) => (slide.highlights || []).join(', ');

  return (
    <section className="admin-package-section">
      {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
      {successMessage ? (
        <div className="admin-alert admin-alert-success">{successMessage}</div>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <p className="admin-panel-kicker">Region picker</p>
            <h2>Editing: {activeRegion}</h2>
          </div>
          <div className="admin-panel-actions">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                className={
                  region === activeRegion ? 'admin-primary-button' : 'admin-secondary-button'
                }
                onClick={() => setActiveRegion(region)}
                disabled={isLoading || isSaving}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p>Loading…</p>
        ) : (
          <form
            className="admin-form-stack"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <fieldset className="admin-fieldset">
              <legend>Header</legend>
              <label className="admin-field">
                <span>Tagline</span>
                <input
                  type="text"
                  value={content.header?.tagline || ''}
                  onChange={(e) => updateField('header.tagline', e.target.value)}
                  placeholder="Curated Kerala journeys with soul"
                />
              </label>
            </fieldset>

            <fieldset className="admin-fieldset">
              <legend>Hero</legend>
              <label className="admin-field">
                <span>Eyebrow</span>
                <input
                  type="text"
                  value={content.hero?.eyebrow || ''}
                  onChange={(e) => updateField('hero.eyebrow', e.target.value)}
                />
              </label>
              <label className="admin-field">
                <span>Title</span>
                <input
                  type="text"
                  value={content.hero?.title || ''}
                  onChange={(e) => updateField('hero.title', e.target.value)}
                />
              </label>
              <label className="admin-field">
                <span>Description</span>
                <textarea
                  rows="3"
                  value={content.hero?.description || ''}
                  onChange={(e) => updateField('hero.description', e.target.value)}
                />
              </label>
              <label className="admin-field">
                <span>Badges (comma separated)</span>
                <input
                  type="text"
                  value={heroBadgesText}
                  onChange={(e) =>
                    updateField(
                      'hero.badges',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </label>

              <div className="admin-subsection">
                <div className="admin-panel-header">
                  <h3>Hero slides</h3>
                  <button type="button" className="admin-secondary-button" onClick={addSlide}>
                    + Add slide
                  </button>
                </div>

                {(content.hero?.slides || []).map((slide, index) => (
                  <div key={index} className="admin-card-inset">
                    <div className="admin-form-grid">
                      <label className="admin-field">
                        <span>Title</span>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => updateSlide(index, 'title', e.target.value)}
                        />
                      </label>
                      <label className="admin-field">
                        <span>Subtitle</span>
                        <input
                          type="text"
                          value={slide.subtitle || ''}
                          onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                        />
                      </label>
                    </div>
                    <label className="admin-field">
                      <span>Description</span>
                      <textarea
                        rows="2"
                        value={slide.description || ''}
                        onChange={(e) => updateSlide(index, 'description', e.target.value)}
                      />
                    </label>
                    <label className="admin-field">
                      <span>Highlights (comma separated)</span>
                      <input
                        type="text"
                        value={slideHighlightsText(slide)}
                        onChange={(e) =>
                          updateSlide(
                            index,
                            'highlights',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                      />
                    </label>
                    <label className="admin-field">
                      <span>Image URL</span>
                      <input
                        type="text"
                        value={slide.imageUrl || ''}
                        onChange={(e) => updateSlide(index, 'imageUrl', e.target.value)}
                        placeholder="/uploads/region-content/... or https://..."
                      />
                    </label>
                    <label className="admin-field">
                      <span>Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlideImageUpload(index, e.target.files?.[0])}
                      />
                      {uploadingSlideIndex === index ? <small>Uploading…</small> : null}
                    </label>
                    {slide.imageUrl ? (
                      <div className="admin-package-image-preview">
                        <img src={slide.imageUrl} alt={slide.title || 'slide preview'} />
                      </div>
                    ) : null}
                    <div className="admin-form-actions">
                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => removeSlide(index)}
                      >
                        Remove slide
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="admin-fieldset">
              <legend>Stats</legend>
              <div className="admin-panel-actions">
                <button type="button" className="admin-secondary-button" onClick={addStat}>
                  + Add stat
                </button>
              </div>
              {(content.stats || []).map((stat, index) => (
                <div key={index} className="admin-form-grid">
                  <label className="admin-field">
                    <span>Value</span>
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="7+"
                    />
                  </label>
                  <label className="admin-field">
                    <span>Label</span>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Curated Kerala packages"
                    />
                  </label>
                  <div className="admin-form-actions">
                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() => removeStat(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </fieldset>

            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={isSaving}>
                {isSaving ? 'Saving…' : `Save ${activeRegion} content`}
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
}

export default RegionContentAdminPanel;
