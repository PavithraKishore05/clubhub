import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../api/eventApi';
import { Card, UserIcon, ClubHubLogo } from './Home';

export default function AllEvents() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('all'); // 'all', 'online', 'offline'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'closed'

  const [starredIds, setStarredIds] = useState([]);

  const loadStarredIds = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('starredEvents') || '[]');
      setStarredIds(stored);
    } catch {
      setStarredIds([]);
    }
  };

  useEffect(() => {
    loadStarredIds();
    window.addEventListener('starredEventsUpdated', loadStarredIds);
    return () => window.removeEventListener('starredEventsUpdated', loadStarredIds);
  }, []);

  useEffect(() => {
    fetchEvents()
      .then(({ data }) => setEvents(data.events || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((ev) => {
    // 1. Search
    const query = search.toLowerCase();
    const titleMatch = (ev.title || '').toLowerCase().includes(query);
    const descMatch = (ev.description || '').toLowerCase().includes(query);
    if (!titleMatch && !descMatch) return false;

    // 2. Venue (Online/Offline)
    if (venueFilter !== 'all') {
      const v = (ev.venue || '').toLowerCase();
      const isOnline = v.includes('online') || v.includes('zoom') || v.includes('meet');
      if (venueFilter === 'online' && !isOnline) return false;
      if (venueFilter === 'offline' && isOnline) return false;
    }

    // 3. Status (Open/Closed)
    if (statusFilter !== 'all') {
      let regStatus = 'open';
      if (ev.registrationDeadline) {
        const deadline = new Date(ev.registrationDeadline);
        deadline.setHours(23, 59, 59, 999);
        if (Date.now() > deadline.getTime()) regStatus = 'closed';
      }
      if (statusFilter !== regStatus) return false;
    }

    return true;
  });

  const starredEvents = filteredEvents.filter(ev => starredIds.includes(ev._id));

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', sans-serif", color: '#111827' }}>
      {/* ── Top Header/Navbar ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <ClubHubLogo />
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-[13.5px] font-semibold text-gray-500 hover:text-red-500 transition-colors" style={{ textDecoration: 'none' }}>
              Home
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4.5 py-2 rounded-xl transition-all shadow-sm"
                    style={{ textDecoration: 'none', padding: '9px 18px' }}
                  >
                    <UserIcon /> Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer border-none"
                  style={{ padding: '10px 20px' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4.5 py-2.5 rounded-xl transition-all shadow-sm"
                style={{ textDecoration: 'none', padding: '10px 20px' }}
              >
                <UserIcon /> Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">All Events</h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input 
              type="text" 
              placeholder="Search events..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select 
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-auto bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Any Venue</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-auto bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Any Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-xs mt-1">Loading events…</p>
          </div>
        ) : (
          <>
            {starredEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Starred Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {starredEvents.map((event) => (
                    <Card key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">
                {starredEvents.length > 0 ? "All Events" : ""}
              </h2>
              {filteredEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '56px 24px', color: '#9ca3af', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#374151' }}>No events found</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card key={event._id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
