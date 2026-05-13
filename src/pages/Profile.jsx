import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, LogOut, Save, Shield, Package } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const savedOrders = localStorage.getItem('luxegold_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My <span className="gold-text">Account</span></h1>
        </div>

        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar glass-panel">
            <div className="avatar-section">
              <div className="avatar">
                <span>{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'details' ? 'active' : ''}`} 
                onClick={() => setActiveTab('details')}
                id="profile-nav-details"
              >
                <User size={18} />
                <span>My Details</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                id="profile-nav-orders"
              >
                <Package size={18} />
                <span>Orders</span>
              </button>
              <button 
                className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
                id="profile-nav-security"
              >
                <Shield size={18} />
                <span>Security</span>
              </button>
            </nav>
            <button className="logout-btn" onClick={handleLogout} id="logout-btn">
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Main content */}
          <div className="profile-content">
            {message && (
              <div className="profile-success animate-fade-in">
                ✓ {message}
              </div>
            )}

            {activeTab === 'details' && (
              <>
                <div className="profile-card glass-panel">
                  <div className="card-header">
                    <h2>Personal Information</h2>
                    {!isEditing ? (
                      <button className="btn-edit" onClick={() => setIsEditing(true)} id="edit-profile-btn">
                        Edit Profile
                      </button>
                    ) : (
                      <button className="btn-cancel" onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email, phone: user.phone, address: user.address || '' }); }}>
                        Cancel
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSave} className="profile-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label><User size={14} /> Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          <div className="field-value">{user.name}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label><Mail size={14} /> Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          <div className="field-value">{user.email}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label><Phone size={14} /> Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        ) : (
                          <div className="field-value">{user.phone || 'Not set'}</div>
                        )}
                      </div>

                      <div className="form-group full-width">
                        <label><MapPin size={14} /> Delivery Address</label>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter your delivery address"
                          />
                        ) : (
                          <div className="field-value">{user.address || 'Not set'}</div>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <button type="submit" className="btn-save" id="save-profile-btn">
                        <Save size={16} /> Save Changes
                      </button>
                    )}
                  </form>
                </div>

                <div className="membership-card">
                  <div className="membership-content">
                    <div className="membership-badge">✦</div>
                    <div>
                      <h3>Gold Member</h3>
                      <p>Enjoy exclusive member benefits including priority shipping and special pricing.</p>
                    </div>
                  </div>
                  <div className="membership-glow"></div>
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="profile-card glass-panel animate-fade-in">
                <div className="card-header">
                  <h2>Order History</h2>
                </div>
                {orders.length === 0 ? (
                  <div className="no-orders text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.slice().reverse().map((order) => (
                      <div key={order.id} className="order-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <strong className="gold-text">Order #{order.id}</strong>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                              {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ 
                              background: order.status === 'Processing' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                              color: order.status === 'Processing' ? 'var(--primary-gold)' : '#4caf50',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-items-preview" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                          {order.items.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', minWidth: '250px' }}>
                              <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.price.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                          </div>
                          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            Total: ${order.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="profile-card glass-panel animate-fade-in">
                <div className="card-header">
                  <h2>Security Settings</h2>
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your password and security preferences.</p>
                
                <form className="profile-form">
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>Current Password</label>
                    <input type="password" placeholder="••••••••" disabled />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" disabled />
                  </div>
                  <button type="button" className="btn-primary" disabled style={{ opacity: 0.5 }}>
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
