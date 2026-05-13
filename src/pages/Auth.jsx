import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, ArrowRight, Gem } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      if (!formData.phone || formData.phone.length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }
      const result = register(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' });
  };

  return (
    <div className="auth-page">
      {/* Background decorative elements */}
      <div className="auth-bg-decor">
        <div className="bg-ring ring-1"></div>
        <div className="bg-ring ring-2"></div>
        <div className="bg-ring ring-3"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }} />
          ))}
        </div>
      </div>

      <div className="auth-container">
        {/* Left Panel - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <Link to="/" className="auth-logo">
              <Gem size={40} />
              <span className="gold-text">LUXEGOLD</span>
            </Link>
            <h1>
              {isLogin ? 'Welcome Back' : 'Join the Legacy'}
            </h1>
            <p>
              {isLogin
                ? 'Sign in to access your curated collection and exclusive member benefits.'
                : 'Create an account to start your journey into the world of luxury gold jewelry.'}
            </p>
            <div className="branding-features">
              <div className="feature">
                <div className="feature-icon">✦</div>
                <span>Exclusive Member Pricing</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✦</div>
                <span>Order Tracking & History</span>
              </div>
              <div className="feature">
                <div className="feature-icon">✦</div>
                <span>Personalized Recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-form-panel glass-panel">
          <div className="form-header">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p>{isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
            {!isLogin && (
              <div className="form-group animate-slide-in" style={{ animationDelay: '0.05s' }}>
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group animate-slide-in" style={{ animationDelay: '0.15s' }}>
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="form-group animate-slide-in" style={{ animationDelay: '0.2s' }}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group animate-slide-in" style={{ animationDelay: '0.25s' }}>
                  <label htmlFor="phone">Phone Number</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group animate-slide-in" style={{ animationDelay: '0.3s' }}>
                  <label htmlFor="address">Delivery Address <span className="optional">(optional)</span></label>
                  <div className="input-wrapper textarea-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <textarea
                      id="address"
                      name="address"
                      placeholder="Enter your delivery address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>
            <button className="switch-btn" onClick={switchMode} id="auth-switch-btn">
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
