import React from 'react';
import InquiryForm from './InquiryForm';

function ContactModal({ open, onClose, region = '' }) {
  const firstFieldRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (firstFieldRef.current) firstFieldRef.current.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="book-now-overlay" onClick={onClose} role="presentation">
      <div
        className="book-now-modal contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="book-now-close"
          onClick={onClose}
          aria-label="Close contact form"
        >
          &times;
        </button>

        <p className="footer-kicker">Let’s talk</p>
        <h3 id="contact-modal-title" className="book-now-title">
          Get a FREE Holiday Plan
        </h3>
        <p className="book-now-subtitle">
          We will provide you a FREE holiday itinerary and plan based on the details you
          share below.
        </p>

        <InquiryForm
          region={region}
          idPrefix="contact-modal"
          source="landing"
          firstFieldRef={firstFieldRef}
        />
      </div>
    </div>
  );
}

export default ContactModal;
