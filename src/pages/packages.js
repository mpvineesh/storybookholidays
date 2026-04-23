import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';

import DatService from '../services/dataService';
import { getPackages as getPackagesFromApi } from '../services/itineraryAdminApi';

function Packages() {
  const [packages, setPackages] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPackagesFromApi();
        setPackages(response.data || []);
      } catch (error) {
        const fallbackData = await new DatService().getPackages();
        setPackages(fallbackData);
        setErrorMessage('Showing existing package data because the package API is unavailable.');
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Header parent="Packages" />
      <main className="content packages-page">
        <section className="packages-section">
          <div className="container">
            {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
            <div className="packages-grid">
              {packages.map((pack) => (
                <article key={pack._id || pack.slug || pack.packageName} className="offer-item package-card">
                  <figure className="featured-image">
                    <img
                      src={pack.imageUrl || `assets/images/packages/${pack.image}`}
                      height="300"
                      className="package-image"
                      alt={pack.title}
                    />
                  </figure>
                  <div className="package-card-body">
                    <h2 className="entry-title">
                      <a href={`/package/${pack.slug || pack.packageName}`}>{pack.title}</a>
                    </h2>
                    <p>{pack.shortDescription}</p>
                  </div>
                  <div className="price">
                    <small>{pack.duration || 'Flexible duration'}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export default Packages;
