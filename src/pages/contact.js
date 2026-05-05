import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { useRegionContent } from '../context/RegionContext';
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

function Contact() {
  const { region } = useRegionContent();
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
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        arrivalDate: form.arrivalDate,
        numberOfNights: form.numberOfNights,
        accommodationType: form.accommodationType,
        isHoneymoon: form.isHoneymoon === 'Yes',
        region,
      });
      setSuccessMessage(
        'Thank you! We have received your enquiry and will share a tailored plan shortly.'
      );
      setForm(initialFormState);
    } catch (error) {
      setErrorMessage(error.message || 'Could not submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Seo
        title="Contact Us"
        description="Contact Story Book Holidays — call +91 94464 60533 or email info@storybookholidays.com to plan your Kerala, India or international holiday."
        path="/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: 'Story Book Holidays',
          telephone: '+91-94464-60533',
          email: 'info@storybookholidays.com',
          address: [
            {
              '@type': 'PostalAddress',
              streetAddress: 'Opp. Sreevalsam Auditorium, Theru Road',
              addressLocality: 'Nileshwar',
              addressRegion: 'Kasaragod, Kerala',
              addressCountry: 'IN',
            },
            {
              '@type': 'PostalAddress',
              streetAddress: '2nd floor, Thahi complex, Chakkaraparambu road, Vennela',
              addressLocality: 'Kochi',
              addressRegion: 'Kerala',
              addressCountry: 'IN',
            },
          ],
        }}
      />
      <Header parent="Contact Us" />
      <main className="content">
        <div className="fullwidth-block">
          <div className="container">
            <div className="row inquiry-row">
              <div className="col-md-7 wow fadeInLeft">
                <div className="inquiry-card">
                  <h2 className="inquiry-title">Get a FREE Holiday Plan</h2>
                  <p className="inquiry-subtitle">
                    We will provide you a FREE Holiday Itinerary &amp; plan based on the
                    details you share with us in the below form.
                  </p>

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
                      <label className="inquiry-label" htmlFor="inquiry-name">
                        Name <span className="inquiry-required">*</span>
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={updateField('name')}
                        autoComplete="name"
                      />
                    </div>

                    <div className="inquiry-grid">
                      <div className="inquiry-field">
                        <label className="inquiry-label" htmlFor="inquiry-email">
                          Email Address <span className="inquiry-required">*</span>
                        </label>
                        <input
                          id="inquiry-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={updateField('email')}
                          autoComplete="email"
                        />
                      </div>
                      <div className="inquiry-field">
                        <label className="inquiry-label" htmlFor="inquiry-phone">
                          Phone (with country codes) <span className="inquiry-required">*</span>
                        </label>
                        <input
                          id="inquiry-phone"
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
                        <label className="inquiry-label" htmlFor="inquiry-arrival">
                          Tentative Date of Arrival
                        </label>
                        <input
                          id="inquiry-arrival"
                          type="date"
                          value={form.arrivalDate}
                          min={minArrivalDate}
                          onChange={updateField('arrivalDate')}
                        />
                      </div>
                      <div className="inquiry-field">
                        <label className="inquiry-label" htmlFor="inquiry-nights">
                          No. of Nights <span className="inquiry-required">*</span>
                        </label>
                        <input
                          id="inquiry-nights"
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
                        <label className="inquiry-label" htmlFor="inquiry-accommodation">
                          Select Accommodation Type
                        </label>
                        <select
                          id="inquiry-accommodation"
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
                        <label className="inquiry-label" htmlFor="inquiry-honeymoon">
                          Are you looking for a Honeymoon?
                        </label>
                        <select
                          id="inquiry-honeymoon"
                          value={form.isHoneymoon}
                          onChange={updateField('isHoneymoon')}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </div>
                    </div>

                    <div className="inquiry-actions">
                      <button
                        type="submit"
                        className="button"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting…' : 'Send Enquiry'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-md-4 col-md-push-1 wow fadeInRight">
                <h4>Story Book Holidays</h4>
                <ul className="list-fa">
                  <li>
                    <i className="fa fa-map-marker"></i>Opp. Sreevalsam Auditorium, Theru Road,
                    Nileshwar, Kasaragod
                  </li>
                  <li>
                    <i className="fa fa-map-marker"></i>Cochin office: 2nd floor, Thahi complex,
                    Chakkaraparambu road, Post Vennela, Kochi, Kerala
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> +91 94464 60533
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i>info@storybookholidays.com
                  </li>
                </ul>
                <div className="map">
                  <iframe
                    title="Story Book Holidays location map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.956898566006!2d75.12704641461241!3d12.25119609133138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDE1JzA0LjMiTiA3NcKwMDcnNDUuMyJF!5e0!3m2!1sen!2sin!4v1612680431482!5m2!1sen!2sin"
                    width="100%"
                    height="320"
                    frameBorder="0"
                    allowFullScreen=""
                    aria-hidden="false"
                    tabIndex="0"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Contact;
