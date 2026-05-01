import React from 'react';
import { Card, CardBody } from '@/components/ui/Card.jsx';

const PlaceholderPage = ({ title, description }) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="text-sm text-ink-muted mt-1">{description}</p>
    </div>
    <Card>
      <CardBody>
        <p className="text-sm text-ink-muted">
          This section will be implemented in the next phase.
        </p>
      </CardBody>
    </Card>
  </div>
);

export default PlaceholderPage;
