import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createPackage,
  deletePackage,
  getPackages,
  updatePackage,
} from '../../services/itineraryAdminApi';

const PACKAGE_REGIONS = ['Kerala', 'India', 'World'];

const createEmptyPackageForm = () => ({
  title: '',
  slug: '',
  region: 'Kerala',
  duration: '',
  shortDescription: '',
  contentHtml: '',
});

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'blockquote'],
    ['clean'],
  ],
};

function PackageAdminPanel({ token, workspaceSearch = '' }) {
  const [packages, setPackages] = React.useState([]);
  const [packageForm, setPackageForm] = React.useState(createEmptyPackageForm());
  const [selectedPackageId, setSelectedPackageId] = React.useState('');
  const [showPackageForm, setShowPackageForm] = React.useState(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [isLoadingPackages, setIsLoadingPackages] = React.useState(false);
  const [isSavingPackage, setIsSavingPackage] = React.useState(false);
  const [deletingPackageId, setDeletingPackageId] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const loadPackages = React.useCallback(async () => {
    setIsLoadingPackages(true);
    setErrorMessage('');

    try {
      const response = await getPackages();
      setPackages(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoadingPackages(false);
    }
  }, []);

  React.useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  React.useEffect(() => {
    if (!selectedImageFile) {
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedImageFile]);

  const resetPackageComposer = () => {
    setSelectedPackageId('');
    setShowPackageForm(false);
    setPackageForm(createEmptyPackageForm());
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setPackageForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const nextFile = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    setSelectedImageFile(nextFile);
    setSuccessMessage('');
    setErrorMessage('');

    if (!nextFile) {
      setImagePreviewUrl('');
    }
  };

  const createFormDataPayload = () => {
    const formData = new FormData();
    formData.append('title', packageForm.title);
    formData.append('slug', packageForm.slug);
    formData.append('region', packageForm.region);
    formData.append('duration', packageForm.duration);
    formData.append('shortDescription', packageForm.shortDescription);
    formData.append('contentHtml', packageForm.contentHtml);

    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    return formData;
  };

  const handlePackageSubmit = async (event) => {
    event.preventDefault();
    setIsSavingPackage(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = createFormDataPayload();
      const response = selectedPackageId
        ? await updatePackage(token, selectedPackageId, payload)
        : await createPackage(token, payload);

      await loadPackages();
      setSelectedPackageId(response.data._id);
      setPackageForm({
        title: response.data.title || '',
        slug: response.data.slug || '',
        region: response.data.region || 'Kerala',
        duration: response.data.duration || '',
        shortDescription: response.data.shortDescription || '',
        contentHtml: response.data.contentHtml || '',
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(response.data.imageUrl || '');
      setShowPackageForm(true);
      setSuccessMessage(
        selectedPackageId ? 'Package updated successfully.' : 'Package created successfully.'
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSavingPackage(false);
    }
  };

  const handleEditPackage = (packageEntry) => {
    setSelectedPackageId(packageEntry._id);
    setShowPackageForm(true);
    setPackageForm({
      title: packageEntry.title || '',
      slug: packageEntry.slug || '',
      region: packageEntry.region || 'Kerala',
      duration: packageEntry.duration || '',
      shortDescription: packageEntry.shortDescription || '',
      contentHtml: packageEntry.contentHtml || '',
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(packageEntry.imageUrl || '');
    setErrorMessage('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePackage = async (packageId) => {
    const confirmed = window.confirm('Delete this package permanently?');

    if (!confirmed) {
      return;
    }

    setDeletingPackageId(packageId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deletePackage(token, packageId);
      await loadPackages();

      if (selectedPackageId === packageId) {
        resetPackageComposer();
      }

      setSuccessMessage('Package deleted successfully.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingPackageId('');
    }
  };

  const filteredPackages = packages.filter((packageEntry) => {
    if (!workspaceSearch.trim()) {
      return true;
    }

    const query = workspaceSearch.trim().toLowerCase();
    return [packageEntry.title, packageEntry.slug, packageEntry.shortDescription]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <section className="admin-package-section">
      {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
      {successMessage ? (
        <div className="admin-alert admin-alert-success">{successMessage}</div>
      ) : null}

      <section className="admin-panel admin-table-panel">
        <div className="admin-panel-header">
          <div>
            <p className="admin-panel-kicker">Saved packages</p>
            <h2>{isLoadingPackages ? 'Loading...' : `${filteredPackages.length} packages`}</h2>
          </div>
          <div className="admin-panel-actions">
            <button className="admin-secondary-button" type="button" onClick={loadPackages}>
              Refresh
            </button>
            <button
              className="admin-primary-button"
              type="button"
              onClick={() => {
                setSelectedPackageId('');
                setPackageForm(createEmptyPackageForm());
                setSelectedImageFile(null);
                setImagePreviewUrl('');
                setShowPackageForm(true);
              }}
            >
              Add package
            </button>
          </div>
        </div>

        {showPackageForm ? (
          <section className="admin-inline-editor">
            <div className="admin-panel-header">
              <div>
                <p className="admin-panel-kicker">
                  {selectedPackageId ? 'Editing package' : 'Create package'}
                </p>
                <h2>{selectedPackageId ? 'Update package content' : 'Add a new package'}</h2>
              </div>
              <button className="admin-secondary-button" type="button" onClick={resetPackageComposer}>
                Close form
              </button>
            </div>

            <form className="admin-form-stack" onSubmit={handlePackageSubmit}>
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    name="title"
                    type="text"
                    value={packageForm.title}
                    onChange={handleInputChange}
                    placeholder="Amazing Kerala"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Slug</span>
                  <input
                    name="slug"
                    type="text"
                    value={packageForm.slug}
                    onChange={handleInputChange}
                    placeholder="amazing-kerala"
                  />
                </label>

                <label className="admin-field">
                  <span>Region</span>
                  <select
                    name="region"
                    value={packageForm.region}
                    onChange={handleInputChange}
                    required
                  >
                    {PACKAGE_REGIONS.map((regionOption) => (
                      <option key={regionOption} value={regionOption}>
                        {regionOption}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-field">
                  <span>Duration</span>
                  <input
                    name="duration"
                    type="text"
                    value={packageForm.duration}
                    onChange={handleInputChange}
                    placeholder="6 Days / 5 Nights"
                  />
                </label>

                <label className="admin-field">
                  <span>Cover image</span>
                  <input name="image" type="file" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <label className="admin-field">
                <span>Short description</span>
                <textarea
                  name="shortDescription"
                  value={packageForm.shortDescription}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Short teaser for the packages page"
                />
              </label>

              <label className="admin-field">
                <span>Package content</span>
                <div className="admin-rich-editor">
                  <ReactQuill
                    theme="snow"
                    value={packageForm.contentHtml}
                    onChange={(value) =>
                      setPackageForm((current) => ({
                        ...current,
                        contentHtml: value,
                      }))
                    }
                    modules={quillModules}
                  />
                </div>
              </label>

              {imagePreviewUrl ? (
                <div className="admin-package-image-preview">
                  <span className="admin-field-label">Current image preview</span>
                  <img src={imagePreviewUrl} alt={packageForm.title || 'Package preview'} />
                </div>
              ) : null}

              <div className="admin-form-actions">
                <button className="admin-primary-button" type="submit" disabled={isSavingPackage}>
                  {isSavingPackage ? 'Saving...' : selectedPackageId ? 'Update package' : 'Create package'}
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {!showPackageForm ? (
          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((packageEntry) => (
                  <tr key={packageEntry._id}>
                    <td>{packageEntry.title}</td>
                    <td>{packageEntry.slug}</td>
                    <td>{packageEntry.duration || 'Flexible'}</td>
                    <td>{packageEntry.shortDescription || 'No short description'}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-secondary-button"
                          type="button"
                          onClick={() => handleEditPackage(packageEntry)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-danger-button"
                          type="button"
                          onClick={() => handleDeletePackage(packageEntry._id)}
                          disabled={deletingPackageId === packageEntry._id}
                        >
                          {deletingPackageId === packageEntry._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!isLoadingPackages && filteredPackages.length === 0 ? (
              <div className="admin-empty-state admin-empty-state-table">
                {workspaceSearch
                  ? 'No packages match your search.'
                  : 'No packages found yet. Click Add package to create the first one.'}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default PackageAdminPanel;
