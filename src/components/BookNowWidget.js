import React from 'react';
import { submitInquiry } from '../services/inquiryApi';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BookNowWidget({ packageTitle, packageSlug, region }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const firstFieldRef = React.useRef(null);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const close = React.useCallback(() => {
    setIsOpen(false);
    setErrorMessage('');
  }, []);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (firstFieldRef.current) firstFieldRef.current.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!form.phone.trim()) {
      setErrorMessage('Please enter your mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitInquiry({
        source: 'package',
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        packageTitle,
        packageSlug,
        region,
      });
      setSuccessMessage(
        'Thank you! We have received your booking enquiry and will get back to you shortly.'
      );
      setForm(initialFormState);
    } catch (error) {
      setErrorMessage(error.message || 'Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => {
    setSuccessMessage('');
    setIsOpen(true);
  };

  return (
    <React.Fragment>
      <button type="button" className="book-now-float" onClick={handleOpen}>
        <i className="fa fa-calendar-check-o" aria-hidden="true" />
        <span>Book Now</span>
      </button>

      {isOpen ? (
        <div className="book-now-overlay" onClick={close} role="presentation">
          <div
            className="book-now-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-now-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="book-now-close"
              onClick={close}
              aria-label="Close booking form"
            >
              &times;
            </button>

            <p className="footer-kicker">Book this journey</p>
            <h3 id="book-now-title" className="book-now-title">
              {packageTitle}
            </h3>
            <p className="book-now-subtitle">
              Share your details and we will get in touch to plan your trip.
            </p>

            {successMessage ? (
              <div className="book-now-success">
                <p>{successMessage}</p>
                <button type="button" className="button" onClick={close}>
                  Done
                </button>
              </div>
            ) : (
              <form className="inquiry-form book-now-form" onSubmit={handleSubmit} noValidate>
                {errorMessage ? (
                  <div className="admin-alert admin-alert-error">{errorMessage}</div>
                ) : null}

                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="book-now-name">
                    Name <span className="inquiry-required">*</span>
                  </label>
                  <input
                    id="book-now-name"
                    ref={firstFieldRef}
                    type="text"
                    value={form.name}
                    onChange={updateField('name')}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="inquiry-grid">
                  <div className="inquiry-field">
                    <label className="inquiry-label" htmlFor="book-now-email">
                      Email <span className="inquiry-required">*</span>
                    </label>
                    <input
                      id="book-now-email"
                      type="email"
                      value={form.email}
                      onChange={updateField('email')}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="inquiry-field">
                    <label className="inquiry-label" htmlFor="book-now-phone">
                      Mobile (with country code) <span className="inquiry-required">*</span>
                    </label>
                    <input
                      id="book-now-phone"
                      type="tel"
                      value={form.phone}
                      onChange={updateField('phone')}
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className="inquiry-field">
                  <label className="inquiry-label" htmlFor="book-now-message">
                    Your Enquiry
                  </label>
                  <textarea
                    id="book-now-message"
                    rows={4}
                    value={form.message}
                    onChange={updateField('message')}
                    placeholder="Travel dates, number of travellers, special requests…"
                  />
                </div>

                <div className="inquiry-actions">
                  <button type="submit" className="button" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send Booking Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default BookNowWidget;
