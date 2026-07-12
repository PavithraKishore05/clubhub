import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../api/eventApi';
import { Card } from './Home';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const starredEvents = events.filter(ev => starredIds.includes(ev._id));

  return (
    <div className="app-shell" style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div className="dashboard-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <div className="dashboard-card" style={{ background: '#fff', borderRadius: 16, padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: 40, border: '1px solid #f0f0f0' }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Welcome, {user?.name}</h1>
          <p style={{ margin: '0 0 16px', color: '#6b7280' }}>You're signed in as {user?.email}</p>
          <span style={{ display: 'inline-block', padding: '4px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{user?.role}</span>
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, color: '#111827' }}>Starred Events</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
              <div style={{ width: 24, height: 24, border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 8, fontSize: 13, color: '#9ca3af' }}>Loading your events...</p>
            </div>
          ) : starredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', color: '#9ca3af' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#374151' }}>No starred events yet</p>
              <p style={{ margin: 0, fontSize: 13 }}>Events you star will appear here for easy access.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {starredEvents.map(event => (
                <Card key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
