import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';
import { useRegionContent } from '../context/RegionContext';
import InquiryForm from '../components/InquiryForm';

function Contact() {
  const { region } = useRegionContent();

  return (
    <React.Fragment>
      <Seo
        title="Let's Talk"
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
      <Header parent="Let's Talk" />
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

                  <InquiryForm region={region} idPrefix="inquiry" />
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
                    <i className="fa fa-map-marker"></i>E-518, 1st Floor, Kocchar Plaza, Block E, Sector 7, Near Ramphal Chowk, Dwarka, New Delhi – 110075
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> +91 94464 60533
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> +91 70116 28153 / +91 98993 32931
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
