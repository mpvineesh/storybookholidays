import React from 'react';
import { Plus, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import Alert from '@/components/ui/Alert.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import { Card, CardBody } from '@/components/ui/Card.jsx';
import { getAboutContent, updateAboutContent } from '@/lib/api/aboutContentApi';

const emptyContent = () => ({
  hero: { eyebrow: '', title: '', lead: '', backgroundImageUrl: '', stats: [] },
  story: {
    kicker: '',
    title: '',
    paragraphs: [],
    signatureName: '',
    signatureRole: '',
    glanceKicker: '',
    glance: [],
  },
  mission: { kicker: '', title: '', cards: [] },
  whyBook: { kicker: '', title: '', cards: [] },
  services: { kicker: '', title: '', description: '', items: [] },
  guarantee: { kicker: '', title: '', body: '' },
});

const emptyStat = () => ({ value: '', label: '' });
const emptyGlanceItem = () => ({ title: '', description: '' });
const emptyMissionCard = () => ({ label: '', title: '', body: '' });
const emptyWhyBookCard = () => ({ label: '', title: '', description: '' });

const mergeWithDefaults = (incoming) => {
  const base = emptyContent();
  return {
    hero: {
      ...base.hero,
      ...(incoming?.hero || {}),
      stats: incoming?.hero?.stats || [],
    },
    story: {
      ...base.story,
      ...(incoming?.story || {}),
      paragraphs: incoming?.story?.paragraphs || [],
      glance: incoming?.story?.glance || [],
    },
    mission: {
      ...base.mission,
      ...(incoming?.mission || {}),
      cards: incoming?.mission?.cards || [],
    },
    whyBook: {
      ...base.whyBook,
      ...(incoming?.whyBook || {}),
      cards: incoming?.whyBook?.cards || [],
    },
    services: {
      ...base.services,
      ...(incoming?.services || {}),
      items: incoming?.services?.items || [],
    },
    guarantee: { ...base.guarantee, ...(incoming?.guarantee || {}) },
  };
};

const splitParagraphs = (value) =>
  value
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

const splitLines = (value) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const AboutContentPage = () => {
  const [content, setContent] = React.useState(emptyContent);
  const [storyText, setStoryText] = React.useState('');
  const [servicesText, setServicesText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const applyContent = React.useCallback((incoming) => {
    const merged = mergeWithDefaults(incoming);
    setContent(merged);
    setStoryText(merged.story.paragraphs.join('\n\n'));
    setServicesText(merged.services.items.join('\n'));
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    getAboutContent()
      .then((response) => {
        if (cancelled) return;
        applyContent(response.data);
      })
      .catch((error) => {
        if (cancelled) return;
        setErrorMessage(error.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [applyContent]);

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

  const updateListItem = (section, listKey, index, key, value) => {
    setContent((current) => {
      const list = [...(current[section]?.[listKey] || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...current, [section]: { ...current[section], [listKey]: list } };
    });
  };

  const addListItem = (section, listKey, factory) => {
    setContent((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [listKey]: [...(current[section]?.[listKey] || []), factory()],
      },
    }));
  };

  const removeListItem = (section, listKey, index) => {
    setContent((current) => {
      const list = [...(current[section]?.[listKey] || [])];
      list.splice(index, 1);
      return { ...current, [section]: { ...current[section], [listKey]: list } };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = {
        ...content,
        story: { ...content.story, paragraphs: splitParagraphs(storyText) },
        services: { ...content.services, items: splitLines(servicesText) },
      };
      const response = await updateAboutContent(payload);
      applyContent(response.data);
      setSuccessMessage('About page content saved.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const removeButtonProps = {
    type: 'button',
    variant: 'ghost',
    size: 'sm',
    className: 'text-rose-600 hover:bg-rose-50',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-ink">About Page</h2>
        <p className="text-sm text-ink-muted mt-1">
          Edit the content shown on the public About Us page.
        </p>
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
                <h3 className="text-base font-semibold text-ink">Hero</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Banner at the top of the About page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Eyebrow</Label>
                  <Input
                    value={content.hero.eyebrow}
                    onChange={(event) => updateField('hero.eyebrow', event.target.value)}
                    placeholder="About Story Book Holidays"
                  />
                </div>
                <div>
                  <Label>Background image URL</Label>
                  <Input
                    value={content.hero.backgroundImageUrl}
                    onChange={(event) =>
                      updateField('hero.backgroundImageUrl', event.target.value)
                    }
                    placeholder="/assets/images/slide-kumarakam.jpg or https://..."
                  />
                </div>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(event) => updateField('hero.title', event.target.value)}
                />
              </div>

              <div>
                <Label>Lead paragraph</Label>
                <Textarea
                  rows={3}
                  value={content.hero.lead}
                  onChange={(event) => updateField('hero.lead', event.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Stats</h4>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => addListItem('hero', 'stats', emptyStat)}
                  >
                    <Plus size={14} />
                    Add stat
                  </Button>
                </div>

                {content.hero.stats.length === 0 ? (
                  <p className="text-sm text-ink-muted">No stats added.</p>
                ) : (
                  <div className="space-y-3">
                    {content.hero.stats.map((stat, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-bg-page p-3 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end"
                      >
                        <div>
                          <Label>Value</Label>
                          <Input
                            value={stat.value || ''}
                            onChange={(event) =>
                              updateListItem('hero', 'stats', index, 'value', event.target.value)
                            }
                            placeholder="15+"
                          />
                        </div>
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={stat.label || ''}
                            onChange={(event) =>
                              updateListItem('hero', 'stats', index, 'label', event.target.value)
                            }
                            placeholder="Years in inbound travel"
                          />
                        </div>
                        <Button
                          {...removeButtonProps}
                          onClick={() => removeListItem('hero', 'stats', index)}
                        >
                          Remove
                        </Button>
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
                <h3 className="text-base font-semibold text-ink">Our Story</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Founder story and the &ldquo;At a glance&rdquo; sidebar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.story.kicker}
                    onChange={(event) => updateField('story.kicker', event.target.value)}
                    placeholder="Our Story"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.story.title}
                    onChange={(event) => updateField('story.title', event.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Story paragraphs (separate paragraphs with a blank line)</Label>
                <Textarea
                  rows={12}
                  value={storyText}
                  onChange={(event) => setStoryText(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Signature name</Label>
                  <Input
                    value={content.story.signatureName}
                    onChange={(event) => updateField('story.signatureName', event.target.value)}
                    placeholder="— Justin Jose"
                  />
                </div>
                <div>
                  <Label>Signature role</Label>
                  <Input
                    value={content.story.signatureRole}
                    onChange={(event) => updateField('story.signatureRole', event.target.value)}
                    placeholder="Founder, Story Book Holidays"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <Label>&ldquo;At a glance&rdquo; heading</Label>
                    <Input
                      value={content.story.glanceKicker}
                      onChange={(event) => updateField('story.glanceKicker', event.target.value)}
                      placeholder="At a glance"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="self-end"
                    onClick={() => addListItem('story', 'glance', emptyGlanceItem)}
                  >
                    <Plus size={14} />
                    Add item
                  </Button>
                </div>

                {content.story.glance.length === 0 ? (
                  <p className="text-sm text-ink-muted">No glance items added.</p>
                ) : (
                  <div className="space-y-3">
                    {content.story.glance.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-bg-page p-3 grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-end"
                      >
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={item.title || ''}
                            onChange={(event) =>
                              updateListItem('story', 'glance', index, 'title', event.target.value)
                            }
                            placeholder="Based in Kerala"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={item.description || ''}
                            onChange={(event) =>
                              updateListItem(
                                'story',
                                'glance',
                                index,
                                'description',
                                event.target.value
                              )
                            }
                          />
                        </div>
                        <Button
                          {...removeButtonProps}
                          onClick={() => removeListItem('story', 'glance', index)}
                        >
                          Remove
                        </Button>
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
                  <h3 className="text-base font-semibold text-ink">Mission &amp; Vision</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Cards in the &ldquo;What guides us&rdquo; section.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addListItem('mission', 'cards', emptyMissionCard)}
                >
                  <Plus size={14} />
                  Add card
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.mission.kicker}
                    onChange={(event) => updateField('mission.kicker', event.target.value)}
                    placeholder="What guides us"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.mission.title}
                    onChange={(event) => updateField('mission.title', event.target.value)}
                    placeholder="Mission &amp; vision."
                  />
                </div>
              </div>

              {content.mission.cards.length === 0 ? (
                <p className="text-sm text-ink-muted">No cards added.</p>
              ) : (
                <div className="space-y-3">
                  {content.mission.cards.map((card, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-bg-page p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-ink">Card {index + 1}</p>
                        <Button
                          {...removeButtonProps}
                          onClick={() => removeListItem('mission', 'cards', index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={card.label || ''}
                            onChange={(event) =>
                              updateListItem('mission', 'cards', index, 'label', event.target.value)
                            }
                            placeholder="Our Mission"
                          />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={card.title || ''}
                            onChange={(event) =>
                              updateListItem('mission', 'cards', index, 'title', event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Body</Label>
                        <Textarea
                          rows={3}
                          value={card.body || ''}
                          onChange={(event) =>
                            updateListItem('mission', 'cards', index, 'body', event.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-ink">Why book with us</h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Numbered reason cards.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => addListItem('whyBook', 'cards', emptyWhyBookCard)}
                >
                  <Plus size={14} />
                  Add card
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.whyBook.kicker}
                    onChange={(event) => updateField('whyBook.kicker', event.target.value)}
                    placeholder="Why book with us"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.whyBook.title}
                    onChange={(event) => updateField('whyBook.title', event.target.value)}
                  />
                </div>
              </div>

              {content.whyBook.cards.length === 0 ? (
                <p className="text-sm text-ink-muted">No cards added.</p>
              ) : (
                <div className="space-y-3">
                  {content.whyBook.cards.map((card, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border bg-bg-page p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-ink">Card {index + 1}</p>
                        <Button
                          {...removeButtonProps}
                          onClick={() => removeListItem('whyBook', 'cards', index)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Label</Label>
                          <Input
                            value={card.label || ''}
                            onChange={(event) =>
                              updateListItem('whyBook', 'cards', index, 'label', event.target.value)
                            }
                            placeholder="Tailor-Made"
                          />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={card.title || ''}
                            onChange={(event) =>
                              updateListItem('whyBook', 'cards', index, 'title', event.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          rows={2}
                          value={card.description || ''}
                          onChange={(event) =>
                            updateListItem(
                              'whyBook',
                              'cards',
                              index,
                              'description',
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Services</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  &ldquo;Our Services&rdquo; copy and bullet list.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.services.kicker}
                    onChange={(event) => updateField('services.kicker', event.target.value)}
                    placeholder="Our Services"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.services.title}
                    onChange={(event) => updateField('services.title', event.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={content.services.description}
                  onChange={(event) => updateField('services.description', event.target.value)}
                />
              </div>

              <div>
                <Label>Service items (one per line)</Label>
                <Textarea
                  rows={5}
                  value={servicesText}
                  onChange={(event) => setServicesText(event.target.value)}
                  placeholder={'Bespoke holiday packages\nLuxury resort curation'}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Satisfaction guarantee</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Card beside the services section.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Kicker</Label>
                  <Input
                    value={content.guarantee.kicker}
                    onChange={(event) => updateField('guarantee.kicker', event.target.value)}
                    placeholder="Satisfaction guarantee"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.guarantee.title}
                    onChange={(event) => updateField('guarantee.title', event.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Body</Label>
                <Textarea
                  rows={3}
                  value={content.guarantee.body}
                  onChange={(event) => updateField('guarantee.body', event.target.value)}
                />
              </div>
            </CardBody>
          </Card>

          <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-bg-page/90 backdrop-blur border-t border-border flex items-center justify-end gap-2">
            <span className="text-xs text-ink-muted mr-auto">
              Editing <strong className="text-ink">About Us</strong>
            </span>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving…' : 'Save About content'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AboutContentPage;
