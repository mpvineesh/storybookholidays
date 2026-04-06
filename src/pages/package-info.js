import React from 'react';
import Header from '../common/header';
import Footer from '../common/footer';
import { useLocation } from 'react-router-dom';

import DatService from '../services/dataService';
import PackageData from '../services/packageData';
import { getPackageBySlug } from '../services/itineraryAdminApi';

function PackageInfo() {
  const [packageEntry, setPackageEntry] = React.useState(null);
  const [fallbackPackage, setFallbackPackage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const search = useLocation().search;
  const packageName = new URLSearchParams(search).get('name');

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getPackageBySlug(packageName);
        setPackageEntry(response.data || null);
        setFallbackPackage(null);
      } catch (error) {
        const fallbackData = await new DatService().getPackageDetails(packageName);
        setFallbackPackage(fallbackData);
        setPackageEntry(null);
        setErrorMessage('Showing existing package content because the package API is unavailable.');
      } finally {
        setIsLoading(false);
      }
    };

    if (packageName) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [packageName]);

  return (
  <React.Fragment>
    <Header parent={packageEntry?.title || fallbackPackage?.title || 'Package'} />
      <main className="content">
        <div className="fullwidth-block">
          <div className="container">
            <div className="row">
              <div className="col-md-12 wow fadeInLeft">
                {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
                {isLoading ? <p>Loading package...</p> : null}

                {packageEntry ? (
                  <div className="package-detail-article">
                    <h2 className="section-title">{packageEntry.title}</h2>
                    {packageEntry.duration ? (
                      <p className="package-detail-duration">{packageEntry.duration}</p>
                    ) : null}
                    {packageEntry.imageUrl ? (
                      <figure>
                        <img src={packageEntry.imageUrl} alt={packageEntry.title} height="360" width="100%" />
                      </figure>
                    ) : null}
                    {packageEntry.shortDescription ? (
                      <p className="package-detail-summary">{packageEntry.shortDescription}</p>
                    ) : null}
                    <div
                      className="package-detail-html"
                      dangerouslySetInnerHTML={{ __html: packageEntry.contentHtml }}
                    />
                  </div>
                ) : null}

                {!isLoading && !packageEntry && fallbackPackage ? (
                  <div className="package-detail-article">
                    <h2 className="section-title">{fallbackPackage.title}</h2>
                    <figure>
                      <img
                        src={`assets/images/packages/${fallbackPackage.image}`}
                        alt={fallbackPackage.title}
                        height="360"
                        width="100%"
                      />
                    </figure>
                    <PackageData packageName={packageName} />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </main>
      	<Footer/>
    </React.Fragment>
  );
}

export default PackageInfo;
