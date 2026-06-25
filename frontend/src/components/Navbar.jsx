import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Auth App</span>
      <div className="navbar-links">
        <NavLink to="/dashboard" end>
          Home
        </NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
