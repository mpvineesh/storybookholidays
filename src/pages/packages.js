import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import Seo from '../common/Seo';

import DatService from '../services/dataService';
import { getPackages as getPackagesFromApi } from '../services/itineraryAdminApi';
import { useRegionContent } from '../context/RegionContext';

function Packages() {
  const { region } = useRegionContent();
  const [allPackages, setAllPackages] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPackagesFromApi();
        setAllPackages(response.data || []);
      } catch (error) {
        const fallbackData = await new DatService().getPackages();
        setAllPackages(fallbackData);
        setErrorMessage('Showing existing package data because the package API is unavailable.');
      }
    };

    fetchData();
  }, []);

  const packages = React.useMemo(
    () => allPackages.filter((pack) => (pack.region || 'Kerala') === region),
    [allPackages, region]
  );

  return (
    <React.Fragment>
      <Seo
        title="Holiday Packages — Kerala, India & Worldwide"
        description="Explore curated Kerala, India and international holiday packages by Story Book Holidays. Backwaters, hill stations, beaches, heritage tours and more."
        path="/packages"
      />
      <Header parent="Packages" />
      <main className="content packages-page">
        <section className="packages-section">
          <div className="container">
            {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
            {packages.length === 0 && allPackages.length > 0 ? (
              <p className="packages-empty">
                No {region} packages have been added yet. Switch region from the
                header to see other holidays.
              </p>
            ) : null}
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
