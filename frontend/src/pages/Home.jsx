import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEvents } from '../api/eventApi';
import heroIllustration from './hero_illustration.png';

const TrophySVG = () => (
  <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="52" width="24" height="4" rx="2" fill="#dc2626" opacity="0.18"/>
    <rect x="26" y="44" width="12" height="8" rx="2" fill="#dc2626" opacity="0.3"/>
    <path d="M14 8h36v20c0 9.941-8.059 18-18 18S14 37.941 14 28V8z" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.5"/>
    <path d="M14 14H8a6 6 0 0 0 6 6v-6z" fill="#fecaca" stroke="#dc2626" strokeWidth="2"/>
    <path d="M50 14h6a6 6 0 0 1-6 6v-6z" fill="#fecaca" stroke="#dc2626" strokeWidth="2"/>
    <path d="M24 28l4-4 4 6 6-10 4 8" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="32" cy="18" r="4" fill="#dc2626" opacity="0.25"/>
  </svg>
);


/* ── SVG Icons ───────────────────────────────────────────── */
const CodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const RobotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M12 2v4" /><path d="M12 6a3 3 0 0 0-3 3v2h6V9a3 3 0 0 0-3-3z" />
    <circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" />
  </svg>
);
const PencilIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);
const WebIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <line x1="6" y1="21" x2="6" y2="8" />
  </svg>
);
const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
  </svg>
);
const RocketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);
export const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
export const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
export const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ClubHubLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3.5" fill="#dc2626" />
      <circle cx="7" cy="11.5" r="3" fill="#dc2626" opacity="0.85" />
      <circle cx="17" cy="11.5" r="3" fill="#dc2626" opacity="0.85" />
      <path d="M5 21C5 17.5 7.5 16 12 16C16.5 16 19 17.5 19 21" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2.5 21C2.5 18.5 4.5 17.5 7 17.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M21.5 21C21.5 18.5 19.5 17.5 17 17.5" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
    <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', fontFamily: "'Inter', sans-serif" }}>
      Club<span style={{ color: '#dc2626' }}>Hub</span>
    </span>
  </div>
);

const getEventIcon = (event) => {
  const title = (event.title || '').toLowerCase();
  const desc = (event.description || '').toLowerCase();
  const iconType = event.iconType || '';

  if (iconType === 'code' || title.includes('code') || title.includes('hack') || title.includes('prog') || desc.includes('code')) {
    return <CodeIcon />;
  }
  if (iconType === 'robot' || title.includes('robot') || title.includes('ai') || title.includes('ml') || desc.includes('ai')) {
    return <RobotIcon />;
  }
  if (iconType === 'design' || title.includes('design') || title.includes('ui') || title.includes('ux') || desc.includes('design')) {
    return <PencilIcon />;
  }
  if (iconType === 'web' || title.includes('web') || title.includes('site') || desc.includes('web')) {
    return <WebIcon />;
  }
  return <CalendarIcon />;
};

const getEventCategory = (event) => {
  if (event.category) return event.category;
  const title = (event.title || '').toLowerCase();
  if (title.includes('hackathon') || title.includes('rush') || title.includes('compete')) return 'Hackathon';
  if (title.includes('workshop') || title.includes('learn')) return 'Workshop';
  if (title.includes('bootcamp') || title.includes('camp')) return 'Bootcamp';
  return 'Workshop';
};



export function Card({ event }) {
  const [isStarred, setIsStarred] = useState(() => {
    try {
      const starred = JSON.parse(localStorage.getItem('starredEvents') || '[]');
      return starred.includes(event._id);
    } catch { return false; }
  });

  const toggleStar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let starred = JSON.parse(localStorage.getItem('starredEvents') || '[]');
      if (isStarred) {
        starred = starred.filter(id => id !== event._id);
      } else {
        if (!starred.includes(event._id)) starred.push(event._id);
      }
      localStorage.setItem('starredEvents', JSON.stringify(starred));
      setIsStarred(!isStarred);
      window.dispatchEvent(new Event('starredEventsUpdated')); // dispatch event for dashboard
    } catch {}
  };

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
    : 'TBD';

  // Determine registration open/closed
  let regStatus = 'open'; // default open
  let deadlineStr = null;
  if (event.registrationDeadline) {
    const deadline = new Date(event.registrationDeadline);
    deadline.setHours(23, 59, 59, 999); // end of deadline day
    deadlineStr = deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    if (Date.now() > deadline.getTime()) regStatus = 'closed';
  }
  const isOpen = regStatus === 'open';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 18,
        border: '1px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 36px rgba(220,38,38,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
      }}
    >
      {/* Coloured top accent bar */}
      <div style={{ height: 4, background: isOpen ? 'linear-gradient(90deg,#dc2626,#f87171)' : 'linear-gradient(90deg,#9ca3af,#d1d5db)' }} />

      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 0 }}>

        {/* Header row: icon + title + status badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', flexShrink: 0, border: '1px solid #fee2e2' }}>
            {getEventIcon(event)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827', lineHeight: 1.35 }}>
                {event.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={toggleStar}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isStarred ? '#eab308' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  title={isStarred ? "Unstar event" : "Star event"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isStarred ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  padding: '3px 9px', borderRadius: 999,
                  background: isOpen ? '#dcfce7' : '#fee2e2',
                  color: isOpen ? '#16a34a' : '#dc2626',
                  border: `1px solid ${isOpen ? '#bbf7d0' : '#fecaca'}`,
                  flexShrink: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isOpen ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: 6, marginTop: 4 }}>
              {getEventCategory(event)}
            </span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p style={{ margin: '0 0 12px', fontSize: 12.5, color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.description}
          </p>
        )}

        {/* Details grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
            <span style={{ color: '#9ca3af', flexShrink: 0 }}><CalendarIcon /></span>
            <span><strong style={{ color: '#374151' }}>Date:</strong> {dateStr}</span>
          </div>
          {event.time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              <span style={{ color: '#9ca3af', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <span><strong style={{ color: '#374151' }}>Time:</strong> {event.time}</span>
            </div>
          )}
          {event.venue && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              <span style={{ color: '#9ca3af', flexShrink: 0 }}><MapPinIcon /></span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><strong style={{ color: '#374151' }}>Venue:</strong> {event.venue}</span>
            </div>
          )}
          {event.club && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6b7280' }}>
              <span style={{ color: '#9ca3af', flexShrink: 0 }}><UserIcon /></span>
              <span><strong style={{ color: '#374151' }}>Club:</strong> {event.club}</span>
            </div>
          )}
          {deadlineStr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isOpen ? '#d97706' : '#dc2626' }}>
              <span style={{ color: isOpen ? '#f59e0b' : '#ef4444', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </span>
              <span><strong>Reg. Deadline:</strong> {deadlineStr} {!isOpen && '(Closed)'}</span>
            </div>
          )}
        </div>

        {/* Spacer + Button */}
        <div style={{ marginTop: 'auto' }}>
          <a
            href={event.registrationLink || '#'}
            target={event.registrationLink && event.registrationLink !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, fontWeight: 700,
              color: isOpen ? '#fff' : '#9ca3af',
              background: isOpen ? '#dc2626' : '#f3f4f6',
              border: isOpen ? 'none' : '1px solid #e5e7eb',
              borderRadius: 10, padding: '9px 16px',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
              cursor: isOpen ? 'pointer' : 'not-allowed',
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
          >
            {isOpen ? (<>Register Now <ArrowRightIcon /></>) : 'Registration Closed'}
          </a>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then(({ data }) => setEvents(data.events || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayEvents = events;

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', sans-serif", color: '#111827' }}>

      {/* ── Top Header/Navbar ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <ClubHubLogo />

          {/* Links: Removed Clubs and FAQ */}
          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Events', 'About Us'].map((item) => (
              <a
                key={item}
                href={item === 'Events' ? '#events' : item === 'About Us' ? '#about' : '#'}
                className="text-[13.5px] font-semibold text-gray-500 hover:text-red-500 transition-colors"
                style={{ textDecoration: 'none', position: 'relative', padding: '6px 0' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
              >
                {item}
                {item === 'Home' && (
                  <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#dc2626', borderRadius: 9 }} />
                )}
              </a>
            ))}
          </nav>

          {/* User Sign In Actions */}
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

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'radial-gradient(circle at top right, rgba(254, 242, 242, 0.45) 0%, #ffffff 65%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Column */}
          <div className="flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-none mb-6">
              Discover. Connect.<br />
              <span style={{ color: '#dc2626' }}>Grow Together.</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Explore exciting events, join vibrant clubs and build skills that shape your future.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#events"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-md transition-all hover:scale-105"
                style={{ textDecoration: 'none' }}
              >
                <CalendarIcon /> Explore Events
              </a>
            </div>
          </div>

          {/* Right Column (Custom illustration) */}
          <div className="w-full flex items-center justify-center">
            <img
              src={heroIllustration}
              alt="Discover Connect Grow Together"
              className="w-full max-w-md md:max-w-full h-auto object-contain"
              style={{ maxHeight: 420 }}
            />
          </div>

        </div>
      </section>

      {/* ── Current Open Events ────────────────────────────── */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-50">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900" style={{ margin: 0 }}>
              Current Open Events
            </h2>
          </div>
          <Link
            to="/all-events"
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
            style={{ textDecoration: 'none' }}
          >
            View All Events <ArrowRightIcon />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-2 py-16">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-xs mt-1">Loading events…</p>
          </div>
        ) : displayEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 24px', color: '#9ca3af' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fef2f2', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#dc2626' }}>
              <CalendarIcon />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#374151' }}>No Events Yet</p>
            <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>Check back soon — events will appear here once the admin posts them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <Card key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ── About Us Section ───────────────────────────────── */}
      <section id="about" style={{ background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 60%, #fef2f2 100%)', borderTop: '1px solid #fee2e2' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 999, padding: '4px 14px', marginBottom: 16 }}>About Us</span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#111827', margin: '0 auto 16px', lineHeight: 1.2, maxWidth: 640 }}>
              Why <span style={{ color: '#dc2626' }}>ClubHub</span> Exists
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.75, maxWidth: 640, margin: '0 auto' }}>
              Many students miss exciting opportunities because event information is scattered across different channels. ClubHub brings everything together, making it easier to stay informed and involved in campus life.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 56 }}>
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ),
                title: 'Discover Upcoming Events',
                desc: "Browse all upcoming campus events in one place — no more missing out because you didn't see the flyer.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                ),
                title: 'Register with One Click',
                desc: 'Sign up for workshops, competitions, and activities instantly — quick, easy, and confirmed.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ),
                title: 'Connect with Like-minded Students',
                desc: 'Find and connect with students who share your passions, interests, and goals on campus.',
              },
            ].map((feat, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 4px 24px rgba(220,38,38,0.06)',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(220,38,38,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(220,38,38,0.06)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#fef2f2,#fee2e2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', border: '1px solid #fecaca' }}>
                  {feat.icon}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 800, color: '#111827' }}>{feat.title}</h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: '#6b7280', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>



        </div>
      </section>





    </div>
  );
}
