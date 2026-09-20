import React from 'react';
import { ACCOMMODATION_TYPES, submitInquiry } from '../services/inquiryApi';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  arrivalDate: '',
  numberOfNights: '',
  accommodationType: '',
  isHoneymoon: 'No',
};

const todayIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// The "Let's Talk" holiday-plan form. Used on the contact page and inside
// the landing page popup.
function InquiryForm({
  region = '',
  idPrefix = 'inquiry',
  source,
  submitLabel = 'Send Enquiry',
  firstFieldRef,
  onSuccess,
}) {
  const [form, setForm] = React.useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleNightsChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 2);
    setForm((previous) => ({ ...previous, numberOfNights: digitsOnly }));
  };

  const minArrivalDate = React.useMemo(todayIso, []);
  const fieldId = (name) => `${idPrefix}-${name}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        ...(source ? { source } : {}),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        arrivalDate: form.arrivalDate,
        numberOfNights: form.numberOfNights,
        accommodationType: form.accommodationType,
        isHoneymoon: form.isHoneymoon === 'Yes',
        region,
      });
      const message =
        'Thank you! We have received your enquiry and will share a tailored plan shortly.';
      setSuccessMessage(message);
      setForm(initialFormState);
      if (onSuccess) onSuccess(message);
    } catch (error) {
      setErrorMessage(error.message || 'Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      {successMessage ? (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      ) : null}
      {errorMessage ? (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
        <div className="inquiry-field">
          <label className="inquiry-label" htmlFor={fieldId('name')}>
            Name <span className="inquiry-required">*</span>
          </label>
          <input
            id={fieldId('name')}
            ref={firstFieldRef}
            type="text"
            required
            value={form.name}
            onChange={updateField('name')}
            autoComplete="name"
          />
        </div>

        <div className="inquiry-grid">
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('email')}>
              Email Address <span className="inquiry-required">*</span>
            </label>
            <input
              id={fieldId('email')}
              type="email"
              required
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
            />
          </div>
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('phone')}>
              Phone (with country codes) <span className="inquiry-required">*</span>
            </label>
            <input
              id={fieldId('phone')}
              type="tel"
              required
              value={form.phone}
              onChange={updateField('phone')}
              autoComplete="tel"
              placeholder="+91 ..."
            />
          </div>
        </div>

        <div className="inquiry-grid">
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('arrival')}>
              Tentative Date of Arrival
            </label>
            <input
              id={fieldId('arrival')}
              type="date"
              value={form.arrivalDate}
              min={minArrivalDate}
              onChange={updateField('arrivalDate')}
            />
          </div>
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('nights')}>
              No. of Nights <span className="inquiry-required">*</span>
            </label>
            <input
              id={fieldId('nights')}
              type="text"
              inputMode="numeric"
              required
              value={form.numberOfNights}
              onChange={handleNightsChange}
              maxLength={2}
            />
            <span className="inquiry-help">
              Maximum of 2 digits. Currently Used: {form.numberOfNights.length} digits.
            </span>
          </div>
        </div>

        <div className="inquiry-grid">
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('accommodation')}>
              Select Accommodation Type
            </label>
            <select
              id={fieldId('accommodation')}
              value={form.accommodationType}
              onChange={updateField('accommodationType')}
            >
              <option value="">Select Type of Stay</option>
              {ACCOMMODATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="inquiry-field">
            <label className="inquiry-label" htmlFor={fieldId('honeymoon')}>
              Are you looking for a Honeymoon?
            </label>
            <select
              id={fieldId('honeymoon')}
              value={form.isHoneymoon}
              onChange={updateField('isHoneymoon')}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="inquiry-actions">
          <button type="submit" className="button" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : submitLabel}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default InquiryForm;
