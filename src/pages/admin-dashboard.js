import React from 'react';
import './admin-dashboard.css';
import PackageAdminPanel from '../components/admin/PackageAdminPanel';
import {
  adminLogin,
  createItinerary,
  deleteItinerary,
  getAdminSession,
  getItineraries,
  updateItinerary,
} from '../services/itineraryAdminApi';

const ADMIN_TOKEN_STORAGE_KEY = 'storybook_admin_token';

const createEmptyDay = (dayNumber = 1) => ({
  dayNumber,
  title: '',
  description: '',
  activities: '',
});

const createEmptyForm = () => ({
  title: '',
  destination: '',
  description: '',
  durationDays: 1,
  price: '',
  highlights: '',
  days: [createEmptyDay(1)],
});

const parseTextList = (value) =>
  value
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);

const formatTextList = (values = []) => values.join('\n');

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

const mapItineraryToForm = (itinerary) => ({
  title: itinerary.title || '',
  destination: itinerary.destination || '',
  description: itinerary.description || '',
  durationDays: itinerary.durationDays || 1,
  price: itinerary.price ?? '',
  highlights: formatTextList(itinerary.highlights),
  days:
    itinerary.days && itinerary.days.length > 0
      ? itinerary.days.map((day, index) => ({
          dayNumber: index + 1,
          title: day.title || '',
          description: day.description || '',
          activities: formatTextList(day.activities),
        }))
      : [createEmptyDay(1)],
});

const buildPayload = (formState) => ({
  title: formState.title.trim(),
  destination: formState.destination.trim(),
  description: formState.description.trim(),
  durationDays: Number(formState.durationDays),
  price: formState.price === '' ? undefined : Number(formState.price),
  highlights: parseTextList(formState.highlights),
  days: formState.days.map((day, index) => ({
    dayNumber: index + 1,
    title: day.title.trim(),
    description: day.description.trim(),
    activities: parseTextList(day.activities),
  })),
});

const adminSections = [
  {
    id: 'itineraries',
    icon: 'fa-plane',
    label: 'Itineraries',
    title: 'Itineraries',
    description: 'Track and manage all itinerary records',
  },
  {
    id: 'packages',
    icon: 'fa-briefcase',
    label: 'Packages',
    title: 'Packages',
    description: 'Track and manage all package publishing records',
  },
];

function AdminDashboard() {
  const [token, setToken] = React.useState(() => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '');
  const [adminUser, setAdminUser] = React.useState('');
  const [activeSection, setActiveSection] = React.useState('itineraries');
  const [workspaceSearch, setWorkspaceSearch] = React.useState('');
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [formState, setFormState] = React.useState(createEmptyForm());
  const [itineraries, setItineraries] = React.useState([]);
  const [selectedId, setSelectedId] = React.useState(null);
  const [showItineraryForm, setShowItineraryForm] = React.useState(false);
  const [isCheckingSession, setIsCheckingSession] = React.useState(Boolean(token));
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [isLoadingItineraries, setIsLoadingItineraries] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const resetComposer = React.useCallback(() => {
    setSelectedId(null);
    setShowItineraryForm(false);
    setFormState(createEmptyForm());
  }, []);

  const loadItineraries = React.useCallback(async () => {
    setIsLoadingItineraries(true);
    setErrorMessage('');

    try {
      const response = await getItineraries();
      setItineraries(response.data || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoadingItineraries(false);
    }
  }, []);

  React.useEffect(() => {
    if (!token) {
      setIsCheckingSession(false);
      return;
    }

    let isMounted = true;

    const checkSession = async () => {
      setIsCheckingSession(true);
      setErrorMessage('');

      try {
        const response = await getAdminSession(token);

        if (!isMounted) {
          return;
        }

        setAdminUser(response.user.username);
        await loadItineraries();
      } catch (error) {
        if (!isMounted) {
          return;
        }

        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
        setToken('');
        setAdminUser('');
        setErrorMessage(error.message);
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [token, loadItineraries]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleDayChange = (index, field, value) => {
    setFormState((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              [field]: value,
            }
          : day
      ),
    }));
  };

  const addDay = () => {
    setFormState((current) => ({
      ...current,
      days: [...current.days, createEmptyDay(current.days.length + 1)],
    }));
  };

  const removeDay = (index) => {
    setFormState((current) => {
      const nextDays = current.days.filter((_day, dayIndex) => dayIndex !== index);

      return {
        ...current,
        days: nextDays.length > 0 ? nextDays : [createEmptyDay(1)],
      };
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await adminLogin(loginForm);
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, response.token);
      setToken(response.token);
      setAdminUser(response.user.username);
      setLoginForm({ username: '', password: '' });
      setSuccessMessage('Login successful.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEdit = (itinerary) => {
    setActiveSection('itineraries');
    setSelectedId(itinerary._id);
    setShowItineraryForm(true);
    setFormState(mapItineraryToForm(itinerary));
    setSuccessMessage('');
    setErrorMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken('');
    setAdminUser('');
    setItineraries([]);
    setSuccessMessage('You have been logged out.');
    setErrorMessage('');
    resetComposer();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = buildPayload(formState);
      const response = selectedId
        ? await updateItinerary(token, selectedId, payload)
        : await createItinerary(token, payload);

      await loadItineraries();
      setSelectedId(response.data._id);
      setShowItineraryForm(true);
      setFormState(mapItineraryToForm(response.data));
      setSuccessMessage(
        selectedId ? 'Itinerary updated successfully.' : 'Itinerary created successfully.'
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (itineraryId) => {
    const confirmed = window.confirm('Delete this itinerary permanently?');

    if (!confirmed) {
      return;
    }

    setDeletingId(itineraryId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await deleteItinerary(token, itineraryId);
      await loadItineraries();

      if (selectedId === itineraryId) {
        resetComposer();
      }

      setSuccessMessage('Itinerary deleted successfully.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingId('');
    }
  };

  if (!token || isCheckingSession) {
    return (
      <main className="admin-page">
        <section className="admin-login-shell">
          <div className="admin-login-card">
            <p className="admin-eyebrow">Storybook Holidays</p>
            <h1>Admin dashboard</h1>
            <p className="admin-support-copy">
              Sign in with the admin username and password from your environment file.
            </p>
            {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
            {successMessage ? (
              <div className="admin-alert admin-alert-success">{successMessage}</div>
            ) : null}
            {isCheckingSession ? (
              <p className="admin-status-line">Checking saved session...</p>
            ) : (
              <form className="admin-form-stack" onSubmit={handleLoginSubmit}>
                <label className="admin-field">
                  <span>Username</span>
                  <input
                    name="username"
                    type="text"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    placeholder="Enter admin username"
                    autoComplete="username"
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Password</span>
                  <input
                    name="password"
                    type="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <button className="admin-primary-button" type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    );
  }

  const currentSection =
    adminSections.find((section) => section.id === activeSection) || adminSections[0];

  const filteredItineraries = itineraries.filter((itinerary) => {
    if (!workspaceSearch.trim()) {
      return true;
    }

    const query = workspaceSearch.trim().toLowerCase();
    return [itinerary.title, itinerary.destination, itinerary.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-app-shell">
          <div className="admin-layout">
            <aside className="admin-sidebar">
              <div>
                <div className="admin-brand-row">
                  <div className="admin-brand-mark">
                    <i className="fa fa-bar-chart" />
                  </div>
                  <div>
                    <p className="admin-brand-name">Storybook</p>
                    <small className="admin-brand-role">Dashboard</small>
                  </div>
                </div>

                <nav className="admin-side-nav" aria-label="Admin sections">
                  {adminSections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={`admin-side-nav-item ${
                        activeSection === section.id ? 'admin-side-nav-item-active' : ''
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className="admin-side-nav-icon">
                        <i className={`fa ${section.icon}`} />
                      </span>
                      <span className="admin-side-nav-copy">
                        <span className="admin-side-nav-label">{section.label}</span>
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="admin-sidebar-footer">
                <button className="admin-sidebar-signout" type="button" onClick={handleLogout}>
                  <i className="fa fa-sign-out" />
                  <span>Sign out</span>
                </button>
                <div className="admin-sidebar-session">
                  <span className="admin-session-label">Signed in as</span>
                  <strong>{adminUser}</strong>
                </div>
              </div>
            </aside>

            <div className="admin-main">
              <div className="admin-topbar">
                <div className="admin-page-header">
                  <h1>{currentSection.title}</h1>
                  <p>{currentSection.description}</p>
                </div>

                <div className="admin-topbar-search">
                  <i className="fa fa-search" />
                  <input
                    type="search"
                    value={workspaceSearch}
                    onChange={(event) => setWorkspaceSearch(event.target.value)}
                    placeholder={
                      activeSection === 'itineraries'
                        ? 'Search itineraries...'
                        : 'Search packages...'
                    }
                  />
                </div>
              </div>

              {activeSection === 'itineraries' ? (
                <section className="admin-panel admin-table-panel">
                  {errorMessage ? <div className="admin-alert admin-alert-error">{errorMessage}</div> : null}
                  {successMessage ? (
                    <div className="admin-alert admin-alert-success">{successMessage}</div>
                  ) : null}

                  <div className="admin-panel-header">
                    <div>
                      <p className="admin-panel-kicker">Saved itineraries</p>
                      <h2>{isLoadingItineraries ? 'Loading...' : `${filteredItineraries.length} itineraries`}</h2>
                    </div>
                    <div className="admin-panel-actions">
                      <button className="admin-secondary-button" type="button" onClick={loadItineraries}>
                        Refresh
                      </button>
                      <button
                        className="admin-primary-button"
                        type="button"
                        onClick={() => {
                          setSelectedId(null);
                          setShowItineraryForm(true);
                          setFormState(createEmptyForm());
                        }}
                      >
                        Add itinerary
                      </button>
                    </div>
                  </div>

                  {showItineraryForm ? (
                    <section className="admin-inline-editor">
                      <div className="admin-panel-header">
                        <div>
                          <p className="admin-panel-kicker">
                            {selectedId ? 'Editing itinerary' : 'Create itinerary'}
                          </p>
                          <h2>{selectedId ? 'Update itinerary details' : 'Add a new itinerary'}</h2>
                        </div>
                        <button className="admin-secondary-button" type="button" onClick={resetComposer}>
                          Close form
                        </button>
                      </div>

                      <form className="admin-form-stack" onSubmit={handleSubmit}>
                        <div className="admin-form-grid">
                          <label className="admin-field">
                            <span>Title</span>
                            <input
                              name="title"
                              type="text"
                              value={formState.title}
                              onChange={handleFormChange}
                              placeholder="Kerala Monsoon Escape"
                              required
                            />
                          </label>

                          <label className="admin-field">
                            <span>Destination</span>
                            <input
                              name="destination"
                              type="text"
                              value={formState.destination}
                              onChange={handleFormChange}
                              placeholder="Kerala"
                              required
                            />
                          </label>

                          <label className="admin-field">
                            <span>Duration in days</span>
                            <input
                              name="durationDays"
                              type="number"
                              min="1"
                              value={formState.durationDays}
                              onChange={handleFormChange}
                              required
                            />
                          </label>

                          <label className="admin-field">
                            <span>Price</span>
                            <input
                              name="price"
                              type="number"
                              min="0"
                              value={formState.price}
                              onChange={handleFormChange}
                              placeholder="Optional"
                            />
                          </label>
                        </div>

                        <label className="admin-field">
                          <span>Description</span>
                          <textarea
                            name="description"
                            value={formState.description}
                            onChange={handleFormChange}
                            rows="4"
                            placeholder="Short overview of the itinerary"
                          />
                        </label>

                        <label className="admin-field">
                          <span>Highlights</span>
                          <textarea
                            name="highlights"
                            value={formState.highlights}
                            onChange={handleFormChange}
                            rows="4"
                            placeholder="One highlight per line"
                          />
                        </label>

                        <div className="admin-days-section">
                          <div className="admin-panel-header">
                            <div>
                              <p className="admin-panel-kicker">Day plan</p>
                              <h2>Daily itinerary flow</h2>
                            </div>
                            <button className="admin-secondary-button" type="button" onClick={addDay}>
                              Add day
                            </button>
                          </div>

                          <div className="admin-day-stack">
                            {formState.days.map((day, index) => (
                              <article className="admin-day-card" key={`day-${index + 1}`}>
                                <div className="admin-day-card-header">
                                  <h3>Day {index + 1}</h3>
                                  <button
                                    className="admin-text-button"
                                    type="button"
                                    onClick={() => removeDay(index)}
                                  >
                                    Remove
                                  </button>
                                </div>

                                <label className="admin-field">
                                  <span>Day title</span>
                                  <input
                                    type="text"
                                    value={day.title}
                                    onChange={(event) => handleDayChange(index, 'title', event.target.value)}
                                    placeholder="Arrival in Kochi"
                                    required
                                  />
                                </label>

                                <label className="admin-field">
                                  <span>Description</span>
                                  <textarea
                                    value={day.description}
                                    onChange={(event) =>
                                      handleDayChange(index, 'description', event.target.value)
                                    }
                                    rows="3"
                                    placeholder="What happens on this day?"
                                  />
                                </label>

                                <label className="admin-field">
                                  <span>Activities</span>
                                  <textarea
                                    value={day.activities}
                                    onChange={(event) =>
                                      handleDayChange(index, 'activities', event.target.value)
                                    }
                                    rows="3"
                                    placeholder="One activity per line"
                                  />
                                </label>
                              </article>
                            ))}
                          </div>
                        </div>

                        <div className="admin-form-actions">
                          <button className="admin-primary-button" type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : selectedId ? 'Update itinerary' : 'Create itinerary'}
                          </button>
                        </div>
                      </form>
                    </section>
                  ) : null}

                  {!showItineraryForm ? (
                    <div className="admin-table-wrap">
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Destination</th>
                            <th>Duration</th>
                            <th>Price</th>
                            <th>Updated</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItineraries.map((itinerary) => (
                            <tr key={itinerary._id}>
                              <td>{itinerary.title}</td>
                              <td>{itinerary.destination}</td>
                              <td>{itinerary.durationDays} days</td>
                              <td>{itinerary.price ? `INR ${itinerary.price}` : 'NA'}</td>
                              <td>{formatDateTime(itinerary.updatedAt)}</td>
                              <td>
                                <div className="admin-table-actions">
                                  <button
                                    className="admin-secondary-button admin-table-pill-button"
                                    type="button"
                                    onClick={() => handleEdit(itinerary)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="admin-danger-button admin-table-icon-button"
                                    type="button"
                                    onClick={() => handleDelete(itinerary._id)}
                                    disabled={deletingId === itinerary._id}
                                    aria-label="Delete itinerary"
                                  >
                                    <i
                                      className={`fa ${
                                        deletingId === itinerary._id ? 'fa-spinner' : 'fa-trash'
                                      }`}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {!isLoadingItineraries && filteredItineraries.length === 0 ? (
                        <div className="admin-empty-state admin-empty-state-table">
                          {workspaceSearch
                            ? 'No itineraries match your search.'
                            : 'No itineraries found yet. Click Add itinerary to create the first one.'}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {activeSection === 'packages' ? (
                <PackageAdminPanel token={token} workspaceSearch={workspaceSearch} />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
