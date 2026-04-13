import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createDestination,
  deleteDestination,
  getDestinations,
  updateDestination,
} from '../../services/itineraryAdminApi';

const createEmptyDestinationForm = () => ({
  title: '',
  slug: '',
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

const formatDateTime = (value) => {
  if (!value) {
    return 'NA';
  }

  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

function DestinationAdminPanel({ token, workspaceSearch = '' }) {
  const [destinations, setDestinations] = React.useState([]);
  const [destinationForm, setDestinationForm] = React.useState(createEmptyDestinationForm());
  const [selectedDestinationId, setSelectedDestinationId] = React.useState('');
  const [showDestinationForm, setShowDestinationForm] = React.useState(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
  const [isLoadingDestinations, setIsLoadingDestinations] = React.useState(false);
  const [isSavingDestination, setIsSavingDestination] = React.useState(false);
  const [deletingDestinationId, setDeletingDestinationId] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const loadDestinations = React.useCallback(async () => {
    setIsLoadingDestinations(true);
    setErrorMessage('');

    try {
      const response = await getDestinations();
      setDestinations(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoadingDestinations(false);
    }
  }, []);

  React.useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

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

  const resetDestinationComposer = () => {
    setSelectedDestinationId('');
    setShowDestinationForm(false);
    setDestinationForm(createEmptyDestinationForm());
    setSelectedImageFile(null);
    setImagePreviewUrl('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setDestinationForm((current) => ({
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
    formData.append('title', destinationForm.title);
    formData.append('slug', destinationForm.slug);
    formData.append('shortDescription', destinationForm.shortDescription);
    formData.append('contentHtml', destinationForm.contentHtml);

    if (selectedImageFile) {
      formData.append('image', selectedImageFile);
    }

    return formData;
  };

  const handleDestinationSubmit = async (event) => {
    event.preventDefault();
    setIsSavingDestination(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = createFormDataPayload();
      const response = selectedDestinationId
        ? await updateDestination(token, selectedDestinationId, payload)
        : await createDestination(token, payload);

      await loadDestinations();
      setSelectedDestinationId(response.data._id);
      setDestinationForm({
        title: response.data.title || '',
        slug: response.data.slug || '',
        shortDescription: response.data.shortDescription || '',
        contentHtml: response.data.contentHtml || '',
      });
      setSelectedImageFile(null);
      setImagePreviewUrl(response.data.imageUrl || '');
      setShowDestinationForm(true);
      setSuccessMessage(
        selectedDestinationId
          ? 'Destination updated successfully.'
          : 'Destination created successfully.'
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSavingDestination(false);
    }
  };

  const handleEditDestination = (destinationEntry) => {
    setSelectedDestinationId(destinationEntry._id);
    setShowDestinationForm(true);
    setDestinationForm({
      title: destinationEntry.title || '',
      slug: destinationEntry.slug || '',
      shortDescription: destinationEntry.shortDescription || '',
      contentHtml: destinationEntry.contentHtml || '',
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(destinationEntry.imageUrl || '');
    setErrorMessage('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteDestination = async (destinationId) => {
    const confirmed = window.confirm('Delete this destination permanently?');

    if (!confirmed) {
      return;
    }

    setDeletingDestinationId(destinationId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deleteDestination(token, destinationId);
      await loadDestinations();

      if (selectedDestinationId === destinationId) {
        resetDestinationComposer();
      }

      setSuccessMessage('Destination deleted successfully.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingDestinationId('');
    }
  };

  const filteredDestinations = destinations.filter((destinationEntry) => {
    if (!workspaceSearch.trim()) {
      return true;
    }

    const query = workspaceSearch.trim().toLowerCase();
    return [destinationEntry.title, destinationEntry.slug, destinationEntry.shortDescription]
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
            <p className="admin-panel-kicker">Saved destinations</p>
            <h2>
              {isLoadingDestinations ? 'Loading...' : `${filteredDestinations.length} destinations`}
            </h2>
          </div>
          <div className="admin-panel-actions">
            <button className="admin-secondary-button" type="button" onClick={loadDestinations}>
              Refresh
            </button>
            <button
              className="admin-primary-button"
              type="button"
              onClick={() => {
                setSelectedDestinationId('');
                setDestinationForm(createEmptyDestinationForm());
                setSelectedImageFile(null);
                setImagePreviewUrl('');
                setShowDestinationForm(true);
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              Add destination
            </button>
          </div>
        </div>

        {showDestinationForm ? (
          <section className="admin-inline-editor">
            <div className="admin-panel-header">
              <div>
                <p className="admin-panel-kicker">
                  {selectedDestinationId ? 'Editing destination' : 'Create destination'}
                </p>
                <h2>
                  {selectedDestinationId ? 'Update destination content' : 'Add a new destination'}
                </h2>
              </div>
              <button
                className="admin-secondary-button"
                type="button"
                onClick={resetDestinationComposer}
              >
                Close form
              </button>
            </div>

            <form className="admin-form-stack" onSubmit={handleDestinationSubmit}>
              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Title</span>
                  <input
                    name="title"
                    type="text"
                    value={destinationForm.title}
                    onChange={handleInputChange}
                    placeholder="Munnar"
                    required
                  />
                </label>

                <label className="admin-field">
                  <span>Slug</span>
                  <input
                    name="slug"
                    type="text"
                    value={destinationForm.slug}
                    onChange={handleInputChange}
                    placeholder="munnar"
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
                  value={destinationForm.shortDescription}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Short teaser for the destinations page"
                />
              </label>

              <label className="admin-field">
                <span>Destination content</span>
                <div className="admin-rich-editor">
                  <ReactQuill
                    theme="snow"
                    value={destinationForm.contentHtml}
                    onChange={(value) =>
                      setDestinationForm((current) => ({
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
                  <img src={imagePreviewUrl} alt={destinationForm.title || 'Destination preview'} />
                </div>
              ) : null}

              <div className="admin-form-actions">
                <button className="admin-primary-button" type="submit" disabled={isSavingDestination}>
                  {isSavingDestination
                    ? 'Saving...'
                    : selectedDestinationId
                      ? 'Update destination'
                      : 'Create destination'}
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {!showDestinationForm ? (
          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.map((destinationEntry) => (
                  <tr key={destinationEntry._id}>
                    <td>{destinationEntry.title}</td>
                    <td>{destinationEntry.slug}</td>
                    <td>{destinationEntry.shortDescription || 'No short description'}</td>
                    <td>{formatDateTime(destinationEntry.updatedAt)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          className="admin-secondary-button"
                          type="button"
                          onClick={() => handleEditDestination(destinationEntry)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-danger-button"
                          type="button"
                          onClick={() => handleDeleteDestination(destinationEntry._id)}
                          disabled={deletingDestinationId === destinationEntry._id}
                        >
                          {deletingDestinationId === destinationEntry._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!isLoadingDestinations && filteredDestinations.length === 0 ? (
              <div className="admin-empty-state admin-empty-state-table">
                {workspaceSearch
                  ? 'No destinations match your search.'
                  : 'No destinations found yet. Click Add destination to create the first one.'}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  );
}

export default DestinationAdminPanel;
