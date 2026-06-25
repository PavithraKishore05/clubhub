import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="app-shell">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h1>Your profile</h1>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Member since: {joined}</p>
          <span className="role-badge">{user?.role}</span>
        </div>
      </div>
    </div>
  );
}
