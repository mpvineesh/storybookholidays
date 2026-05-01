import React from 'react';
import { Plus, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Alert from '@/components/ui/Alert.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import HeroSlideEditor from '@/components/region-content/HeroSlideEditor.jsx';
import {
  REGIONS,
  getRegionContent,
  updateRegionContent,
} from '@/lib/api/regionContentApi';

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

const emptyDestinationItem = () => ({
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  highlights: [],
});

const emptyTheme = () => ({ label: '', title: '', description: '' });

const emptyStat = () => ({ value: '', label: '' });

const mergeWithDefaults = (incoming) => {
  const base = emptyContent();
  return {
    ...base,
    ...(incoming || {}),
    header: { ...base.header, ...(incoming?.header || {}) },
    hero: {
      ...base.hero,
      ...(incoming?.hero || {}),
      badges: incoming?.hero?.badges || [],
      slides: incoming?.hero?.slides || [],
    },
    planning: {
      ...base.planning,
      ...(incoming?.planning || {}),
      points: incoming?.planning?.points || [],
    },
    destinations: {
      ...base.destinations,
      ...(incoming?.destinations || {}),
      items: incoming?.destinations?.items || [],
    },
    packagesSection: { ...base.packagesSection, ...(incoming?.packagesSection || {}) },
    experience: {
      ...base.experience,
      ...(incoming?.experience || {}),
      themes: incoming?.experience?.themes || [],
    },
    stats: incoming?.stats || [],
  };
};

const splitCsv = (value) =>
  value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

const splitLines = (value) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const RegionContentPage = () => {
  const [activeRegion, setActiveRegion] = React.useState('Kerala');
  const [content, setContent] = React.useState(emptyContent);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const loadContent = React.useCallback(async (region) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await getRegionContent(region);
      setContent(mergeWithDefaults(response.data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadContent(activeRegion);
  }, [activeRegion, loadContent]);

  React.useEffect(() => {
    if (!successMessage) return undefined;
    const timeoutId = window.setTimeout(() => setSuccessMessage(''), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [successMessage]);

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
      const response = await updateRegionContent(activeRegion, content);
      setContent(mergeWithDefaults(response.data));
      setSuccessMessage(`${activeRegion} content saved.`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSlide = (index, nextSlide) => {
    setContent((current) => {
      const slides = [...(current.hero?.slides || [])];
      slides[index] = nextSlide;
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

  const updateDestinationItem = (index, key, value) => {
    setContent((current) => {
      const items = [...(current.destinations?.items || [])];
      items[index] = { ...items[index], [key]: value };
      return { ...current, destinations: { ...current.destinations, items } };
    });
  };

  const addDestinationItem = () => {
    setContent((current) => ({
      ...current,
      destinations: {
        ...current.destinations,
        items: [...(current.destinations?.items || []), emptyDestinationItem()],
      },
    }));
  };

  const removeDestinationItem = (index) => {
    setContent((current) => {
      const items = [...(current.destinations?.items || [])];
      items.splice(index, 1);
      return { ...current, destinations: { ...current.destinations, items } };
    });
  };

  const updateTheme = (index, key, value) => {
    setContent((current) => {
      const themes = [...(current.experience?.themes || [])];
      themes[index] = { ...themes[index], [key]: value };
      return { ...current, experience: { ...current.experience, themes } };
    });
  };

  const addTheme = () => {
    setContent((current) => ({
      ...current,
      experience: {
        ...current.experience,
        themes: [...(current.experience?.themes || []), emptyTheme()],
      },
    }));
  };

  const removeTheme = (index) => {
    setContent((current) => {
      const themes = [...(current.experience?.themes || [])];
      themes.splice(index, 1);
      return { ...current, experience: { ...current.experience, themes } };
    });
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
  const planningPointsText = (content.planning?.points || []).join('\n');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink">Region Content</h2>
          <p className="text-sm text-ink-muted mt-1">
            Configure landing-page content for each region.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {REGIONS.map((region) => (
            <Button
              key={region}
              type="button"
              variant={region === activeRegion ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveRegion(region)}
              disabled={isLoading || isSaving}
            >
              {region}
            </Button>
          ))}
        </div>
      </div>

      {errorMessage ? <Alert tone="error">{errorMessage}</Alert> : null}
      {successMessage ? <Alert tone="success">{successMessage}</Alert> : null}

      {isLoading ? (
        <Card>
          <CardBody className="py-16 grid place-items-center">
            <Spinner />
          </CardBody>
        </Card>
      ) : (
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Header</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Top-of-page tagline shown in the header for {activeRegion}.
                </p>
              </div>
              <div>
                <Label htmlFor="header-tagline">Tagline</Label>
                <Input
                  id="header-tagline"
                  value={content.header?.tagline || ''}
                  onChange={(event) => updateField('header.tagline', event.target.value)}
                  placeholder="Curated Kerala journeys with soul"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Hero</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Hero banner copy and rotating slides on the {activeRegion} landing page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Eyebrow</Label>
                  <Input
                    value={content.hero?.eyebrow || ''}
                    onChange={(event) => updateField('hero.eyebrow', event.target.value)}
                    placeholder="Storybook Holidays"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.hero?.title || ''}
                    onChange={(event) => updateField('hero.title', event.target.value)}
                    placeholder="Discover Kerala"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={content.hero?.description || ''}
                  onChange={(event) => updateField('hero.description', event.target.value)}
                />
              </div>

              <div>
                <Label>Badges (comma separated)</Label>
                <Input
                  value={heroBadgesText}
                  onChange={(event) => updateField('hero.badges', splitCsv(event.target.value))}
                  placeholder="Backwaters, Hill stations, Beaches"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Hero slides</h4>
                  <Button type="button" variant="secondary" size="sm" onClick={addSlide}>
                    <Plus size={14} />
                    Add slide
                  </Button>
                </div>

                {(content.hero?.slides || []).length === 0 ? (
                  <p className="text-sm text-ink-muted">No slides yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(content.hero?.slides || []).map((slide, index) => (
                      <HeroSlideEditor
                        key={index}
                        index={index}
                        slide={slide}
                        onChange={(next) => updateSlide(index, next)}
                        onRemove={() => removeSlide(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Planning</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Bulleted planning points (one per line).
                </p>
              </div>
              <Textarea
                rows={5}
                value={planningPointsText}
                onChange={(event) =>
                  updateField('planning.points', splitLines(event.target.value))
                }
                placeholder={'Best months\nIdeal trip length\nWhat to pack'}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Destinations section</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Section heading and the destination cards displayed on the landing page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.destinations?.kicker || ''}
                    onChange={(event) => updateField('destinations.kicker', event.target.value)}
                    placeholder="Where to go"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.destinations?.title || ''}
                    onChange={(event) => updateField('destinations.title', event.target.value)}
                    placeholder="Iconic destinations"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Featured destinations</h4>
                  <Button type="button" variant="secondary" size="sm" onClick={addDestinationItem}>
                    <Plus size={14} />
                    Add destination
                  </Button>
                </div>

                {(content.destinations?.items || []).length === 0 ? (
                  <p className="text-sm text-ink-muted">No destinations added.</p>
                ) : (
                  <div className="space-y-3">
                    {(content.destinations?.items || []).map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-bg-page p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-ink">
                            Destination {index + 1}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50"
                            onClick={() => removeDestinationItem(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={item.title || ''}
                              onChange={(event) =>
                                updateDestinationItem(index, 'title', event.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Subtitle</Label>
                            <Input
                              value={item.subtitle || ''}
                              onChange={(event) =>
                                updateDestinationItem(index, 'subtitle', event.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(event) =>
                              updateDestinationItem(index, 'description', event.target.value)
                            }
                          />
                        </div>

                        <div>
                          <Label>Image URL</Label>
                          <Input
                            value={item.imageUrl || ''}
                            onChange={(event) =>
                              updateDestinationItem(index, 'imageUrl', event.target.value)
                            }
                            placeholder="/uploads/region-content/... or https://..."
                          />
                        </div>

                        <div>
                          <Label>Highlights (comma separated)</Label>
                          <Input
                            value={(item.highlights || []).join(', ')}
                            onChange={(event) =>
                              updateDestinationItem(
                                index,
                                'highlights',
                                splitCsv(event.target.value)
                              )
                            }
                            placeholder="Tea estates, Waterfalls"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Packages section</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Heading shown above the packages strip on the landing page.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.packagesSection?.kicker || ''}
                    onChange={(event) =>
                      updateField('packagesSection.kicker', event.target.value)
                    }
                    placeholder="Curated journeys"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.packagesSection?.title || ''}
                    onChange={(event) =>
                      updateField('packagesSection.title', event.target.value)
                    }
                    placeholder="Featured packages"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Experience themes</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Themes that describe the {activeRegion} experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.experience?.kicker || ''}
                    onChange={(event) => updateField('experience.kicker', event.target.value)}
                    placeholder="Why travel with us"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.experience?.title || ''}
                    onChange={(event) => updateField('experience.title', event.target.value)}
                    placeholder="A different kind of holiday"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Themes</h4>
                  <Button type="button" variant="secondary" size="sm" onClick={addTheme}>
                    <Plus size={14} />
                    Add theme
                  </Button>
                </div>

                {(content.experience?.themes || []).length === 0 ? (
                  <p className="text-sm text-ink-muted">No themes added.</p>
                ) : (
                  <div className="space-y-3">
                    {(content.experience?.themes || []).map((theme, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-bg-page p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-ink">Theme {index + 1}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-rose-600 hover:bg-rose-50"
                            onClick={() => removeTheme(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label>Label</Label>
                            <Input
                              value={theme.label || ''}
                              onChange={(event) => updateTheme(index, 'label', event.target.value)}
                              placeholder="Slow Luxury"
                            />
                          </div>
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={theme.title || ''}
                              onChange={(event) => updateTheme(index, 'title', event.target.value)}
                              placeholder="Thoughtful journeys"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            rows={2}
                            value={theme.description || ''}
                            onChange={(event) =>
                              updateTheme(index, 'description', event.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-ink">Stats</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Quick numerical highlights shown across the landing page.
                  </p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={addStat}>
                  <Plus size={14} />
                  Add stat
                </Button>
              </div>

              {(content.stats || []).length === 0 ? (
                <p className="text-sm text-ink-muted">No stats added.</p>
              ) : (
                <div className="space-y-3">
                  {(content.stats || []).map((stat, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-bg-page p-3 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end"
                    >
                      <div>
                        <Label>Value</Label>
                        <Input
                          value={stat.value || ''}
                          onChange={(event) => updateStat(index, 'value', event.target.value)}
                          placeholder="7+"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={stat.label || ''}
                          onChange={(event) => updateStat(index, 'label', event.target.value)}
                          placeholder="Curated Kerala packages"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                        onClick={() => removeStat(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-bg-page/90 backdrop-blur border-t border-border flex items-center justify-end gap-2">
            <span className="text-xs text-ink-muted mr-auto">
              Editing <strong className="text-ink">{activeRegion}</strong>
            </span>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving…' : `Save ${activeRegion} content`}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegionContentPage;
