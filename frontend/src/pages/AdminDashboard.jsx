import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchEvents, createEvent, updateEvent, removeEvent } from '../api/eventApi';

const EMPTY_FORM = {
  title: '', description: '', date: '', time: '',
  venue: '', club: '', image: '', registrationLink: '',
  registrationDeadline: '',
};

/* ── SVG Icons ───────────────────────────────────────────── */
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const GroupIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const ZapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ErrorCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Inline styles matching CSS variable theme ───────────── */
const S = {
  page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", WebkitFontSmoothing: 'antialiased' },
  header: { background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' },
  headerSub: { margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  signedIn: { fontSize: 13, color: 'var(--text-secondary)' },
  signedInName: { fontWeight: 600, color: 'var(--text-primary)' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--danger)', background: 'none', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: '7px 13px', cursor: 'pointer' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  pageHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  pageTitle: { margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' },
  pageSub: { margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' },
  addBtn: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', padding: '9px 16px', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 },
  statCard: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'var(--shadow-card)' },
  statIcon: { width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--input-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', flexShrink: 0 },
  statLabel: { margin: 0, fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 },
  statValue: { margin: '3px 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 },
  tableCard: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'var(--input-bg)', borderBottom: '1px solid var(--border)' },
  th: { padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', textAlign: 'left' },
  thRight: { padding: '12px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', textAlign: 'right' },
  td: { padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', borderBottom: '1px solid var(--bg)', verticalAlign: 'middle' },
  tdRight: { padding: '14px 16px', fontSize: 13, color: 'var(--text-primary)', borderBottom: '1px solid var(--bg)', verticalAlign: 'middle', textAlign: 'right' },
  eventAvatar: { width: 34, height: 34, borderRadius: 8, background: 'var(--input-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 },
  eventAvatarImg: { width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  clubBadge: { display: 'inline-block', padding: '3px 10px', fontSize: 11, fontWeight: 600, borderRadius: 999, background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)', whiteSpace: 'nowrap' },
  editBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '5px 11px', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--danger)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: '5px 11px', cursor: 'pointer' },
  emptyState: { padding: '64px 24px', textAlign: 'center', color: 'var(--text-secondary)' },
  emptyIcon: { width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--input-bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  spinner: { width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '64px auto' },
  toast: { position: 'fixed', top: 20, right: 20, zIndex: 200, background: 'var(--text-primary)', color: 'var(--accent-text)', fontSize: 13, fontWeight: 500, padding: '11px 18px', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', animation: 'fadeInDown 0.2s ease' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', width: '100%', maxWidth: 480, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid var(--border)' },
  modalTitle: { margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' },
  modalSub: { margin: '3px 0 0', fontSize: 12.5, color: 'var(--text-secondary)' },
  modalCloseBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' },
  modalBody: { overflowY: 'auto', flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 },
  modalFooter: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--input-bg)' },
  cancelBtn: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 16px', cursor: 'pointer' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--accent-text)', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 18px', cursor: 'pointer' },
  inputStyle: { width: '100%', padding: '10px 12px', fontSize: 13.5, background: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.15s ease, background 0.15s ease', boxSizing: 'border-box' },
  errorBanner: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)' },
  confirmModal: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', width: '100%', maxWidth: 360, padding: 28, position: 'relative', textAlign: 'center' },
  confirmIcon: { width: 50, height: 50, borderRadius: '50%', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--danger)' },
};

/* ── Field wrapper ───────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
        {label}
        {required
          ? <span style={{ color: 'var(--danger)', marginLeft: 2 }}> *</span>
          : <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

/* ── Input with focus highlight ──────────────────────────── */
function StyledInput({ type = 'text', name, value, onChange, placeholder, rows }) {
  const [focused, setFocused] = useState(false);
  const base = { ...S.inputStyle, borderColor: focused ? 'var(--accent)' : 'var(--input-border)', background: focused ? 'var(--card-bg)' : 'var(--input-bg)' };
  if (rows) return <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, resize: 'none', fontFamily: 'inherit' }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
  return <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />;
}

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, icon }) {
  return (
    <div style={S.statCard}>
      <div style={S.statIcon}>{icon}</div>
      <div>
        <p style={S.statLabel}>{label}</p>
        <p style={S.statValue}>{value}</p>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');
  const [toast, setToast]       = useState('');

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data } = await fetchEvents();
      setEvents(data.events || []);
    } catch { setError('Failed to load events. Check your connection.'); }
    finally   { setLoading(false); }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openAdd  = () => { setForm(EMPTY_FORM); setEditId(null); setError(''); setModal('add'); };
  const openEdit = (ev) => {
    setForm({ title: ev.title || '', description: ev.description || '', date: ev.date || '', time: ev.time || '', venue: ev.venue || '', club: ev.club || '', image: ev.image || '', registrationLink: ev.registrationLink || '', registrationDeadline: ev.registrationDeadline || '' });
    setEditId(ev._id); setError(''); setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditId(null); setForm(EMPTY_FORM); setError(''); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    const { title, description, date, time, venue, club } = form;
    if (!title || !description || !date || !time || !venue || !club) {
      setError('Please fill in all required fields.'); return;
    }
    setSaving(true);
    try {
      if (modal === 'add') { await createEvent(form); showToast('Event created successfully.'); }
      else                  { await updateEvent(editId, form); showToast('Event updated successfully.'); }
      await loadEvents();
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Try again.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeEvent(deleteId);
      setDeleteId(null);
      await loadEvents();
      showToast('Event deleted.');
    } catch { showToast('Failed to delete event.'); }
    finally { setDeleting(false); }
  };

  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }); };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  const recentCount = events.filter((e) => Date.now() - new Date(e.createdAt).getTime() < 7 * 86400000).length;
  const uniqueClubs = new Set(events.map((e) => e.club)).size;

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeInDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Toast */}
      {toast && <div style={S.toast}>{toast}</div>}

      {/* Header */}
      <header style={S.header}>
        <div>
          <h1 style={S.headerTitle}>Admin Dashboard</h1>
          <p style={S.headerSub}>Event Management Portal</p>
        </div>
        <div style={S.headerRight}>
          <span style={S.signedIn}>
            Signed in as&nbsp;<span style={S.signedInName}>{user?.name}</span>
          </span>
          <button style={S.logoutBtn} onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={S.main}>

        {/* Page title */}
        <div style={S.pageHeader}>
          <div>
            <h2 style={S.pageTitle}>Manage Events</h2>
            <p style={S.pageSub}>Create, edit and delete campus events</p>
          </div>
          <button style={S.addBtn} onClick={openAdd}><PlusIcon /> Add Event</button>
        </div>

        {/* Stats */}
        <div style={S.statsGrid}>
          <StatCard label="Total Events"    value={events.length} icon={<CalendarIcon />} />
          <StatCard label="Unique Clubs"    value={uniqueClubs}   icon={<GroupIcon />} />
          <StatCard label="Added This Week" value={recentCount}   icon={<ZapIcon />} />
        </div>

        {/* Global error */}
        {error && !modal && (
          <div style={{ ...S.errorBanner, marginBottom: 20 }}>
            <ErrorCircleIcon /> {error}
          </div>
        )}

        {/* Events table */}
        <div style={S.tableCard}>
          {loading ? (
            <div style={S.spinner} />
          ) : events.length === 0 ? (
            <div style={S.emptyState}>
              <div style={S.emptyIcon}><CalendarIcon /></div>
              <p style={{ margin: '0 0 4px', fontWeight: 600, color: 'var(--text-primary)' }}>No events yet</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead style={S.thead}>
                  <tr>
                    <th style={{ ...S.th, paddingLeft: 20 }}>Event</th>
                    <th style={S.th}>Club</th>
                    <th style={S.th}>Date &amp; Time</th>
                    <th style={S.th}>Venue</th>
                    <th style={S.th}>Status</th>
                    <th style={S.thRight}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev._id}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...S.td, paddingLeft: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {ev.image
                            ? <img src={ev.image} alt={ev.title} style={S.eventAvatarImg} onError={(e) => { e.target.style.display = 'none'; }} />
                            : <div style={S.eventAvatar}>{ev.title?.[0]?.toUpperCase()}</div>}
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{ev.title}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{ev.description}</p>
                          </div>
                        </div>
                      </td>
                      <td style={S.td}><span style={S.clubBadge}>{ev.club}</span></td>
                      <td style={S.td}>
                        <p style={{ margin: 0, fontSize: 13 }}>{formatDate(ev.date)}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{ev.time || '—'}</p>
                      </td>
                      <td style={S.td}>
                        <p style={{ margin: 0, fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.venue}</p>
                      </td>
                      <td style={S.td}>
                        {(() => {
                          let isClosed = false;
                          if (ev.registrationDeadline) {
                            const dl = new Date(ev.registrationDeadline);
                            dl.setHours(23, 59, 59, 999);
                            isClosed = Date.now() > dl.getTime();
                          }
                          return (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                              padding: '3px 9px', borderRadius: 999,
                              background: isClosed ? 'var(--danger-bg)' : 'rgba(22,163,74,0.08)',
                              color: isClosed ? 'var(--danger)' : '#16a34a',
                              border: `1px solid ${isClosed ? 'var(--danger-border)' : '#bbf7d0'}`,
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isClosed ? '#ef4444' : '#22c55e', display: 'inline-block' }} />
                              {isClosed ? 'Closed' : 'Open'}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={S.tdRight}>
                        <button style={S.editBtn} onClick={() => openEdit(ev)}><EditIcon /> Edit</button>
                        <button style={S.deleteBtn} onClick={() => setDeleteId(ev._id)}><TrashIcon /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={S.overlay} onClick={closeModal}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <div>
                <h3 style={S.modalTitle}>{modal === 'add' ? 'Add New Event' : 'Edit Event'}</h3>
                <p style={S.modalSub}>{modal === 'add' ? 'Fill in the details to create a new event' : 'Update the event details below'}</p>
              </div>
              <button style={S.modalCloseBtn} onClick={closeModal}><CloseIcon /></button>
            </div>

            <div style={S.modalBody}>
              {error && <div style={S.errorBanner}><ErrorCircleIcon /> {error}</div>}

              <Field label="Event Title" required>
                <StyledInput name="title" value={form.title} onChange={handleChange} placeholder="e.g., AI Hackathon 2026" />
              </Field>
              <Field label="Description" required>
                <StyledInput name="description" value={form.description} onChange={handleChange} placeholder="Describe the event…" rows={3} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Date" required>
                  <StyledInput type="date" name="date" value={form.date} onChange={handleChange} />
                </Field>
                <Field label="Time" required>
                  <StyledInput type="time" name="time" value={form.time} onChange={handleChange} />
                </Field>
              </div>
              <Field label="Venue" required>
                <StyledInput name="venue" value={form.venue} onChange={handleChange} placeholder="e.g., Main Auditorium / Online" />
              </Field>
              <Field label="Club" required>
                <StyledInput name="club" value={form.club} onChange={handleChange} placeholder="e.g., CS Club, Robotics Society" />
              </Field>

              <Field label="Registration Link" required={false}>
                <StyledInput type="url" name="registrationLink" value={form.registrationLink} onChange={handleChange} placeholder="https://forms.example.com/register" />
              </Field>
              <Field label="Last Date to Register" required={false}>
                <StyledInput type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} />
                {form.registrationDeadline && (() => {
                  const dl = new Date(form.registrationDeadline);
                  dl.setHours(23, 59, 59, 999);
                  const closed = Date.now() > dl.getTime();
                  return (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: closed ? 'var(--danger)' : '#16a34a', fontWeight: 600 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: closed ? '#ef4444' : '#22c55e', display: 'inline-block' }} />
                      {closed ? 'Registration is CLOSED (deadline passed)' : 'Registration is OPEN'}
                    </div>
                  );
                })()}
              </Field>
            </div>

            <div style={S.modalFooter}>
              <button style={S.cancelBtn} onClick={closeModal}>Cancel</button>
              <button style={{ ...S.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                onClick={handleSubmit} disabled={saving}>
                {saving
                  ? <><div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                  : <><CheckIcon /> {modal === 'add' ? 'Create Event' : 'Save Changes'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={S.overlay} onClick={() => setDeleteId(null)}>
          <div style={S.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={S.confirmIcon}><TrashIcon /></div>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>Delete Event?</h3>
            <p style={{ margin: '0 0 22px', fontSize: 13, color: 'var(--text-secondary)' }}>
              This action cannot be undone. The event will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ ...S.cancelBtn, flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ ...S.deleteBtn, flex: 1, justifyContent: 'center', padding: '8px 16px', opacity: deleting ? 0.6 : 1 }}
                onClick={handleDelete} disabled={deleting}>
                {deleting
                  ? <div style={{ width: 12, height: 12, border: '2px solid rgba(220,38,38,0.3)', borderTopColor: 'var(--danger)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
