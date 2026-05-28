import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
  const { adminLogin, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = adminLogin(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-brand">
          <div className="admin-shield-icon">
            <ShieldCheck size={28} />
          </div>
          <h1><span className="gold-text">LUXEGOLD</span></h1>
          <p>Admin Control Panel</p>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="admin-email"
                type="email"
                placeholder="admin@luxegold.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={16} className="input-icon" />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="input-wrapper">
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} className="input-icon" />
            </div>
          </div>

          {error && (
            <div className="admin-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="admin-submit-btn" id="admin-login-btn">
            Access Dashboard
          </button>
        </form>

        <div className="admin-footer-text">
          <Link to="/">← Back to Store</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
