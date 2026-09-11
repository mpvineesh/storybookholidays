import React from 'react';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Label from '@/components/ui/Label.jsx';

const emptyLink = () => ({ label: '', href: '' });

// Small label + URL list editor used by the footer link panels.
const FooterLinksEditor = ({ title, links = [], onChange, emptyText = 'No links added.' }) => {
  const updateLink = (index, key, value) => {
    const next = [...links];
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };

  const addLink = () => onChange([...links, emptyLink()]);

  const removeLink = (index) => {
    const next = [...links];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-ink">{title}</h4>
        <Button type="button" variant="secondary" size="sm" onClick={addLink}>
          <Plus size={14} />
          Add link
        </Button>
      </div>

      {links.length === 0 ? (
        <p className="text-sm text-ink-muted">{emptyText}</p>
      ) : (
        <div className="space-y-2">
          {links.map((link, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-bg-page p-3 grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end"
            >
              <div>
                <Label>Label</Label>
                <Input
                  value={link.label || ''}
                  onChange={(event) => updateLink(index, 'label', event.target.value)}
                  placeholder="Journeys"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={link.href || ''}
                  onChange={(event) => updateLink(index, 'href', event.target.value)}
                  placeholder="/packages or https://..."
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:bg-rose-50"
                onClick={() => removeLink(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FooterLinksEditor;
