import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Gem, ShoppingBag, Menu, User, LogIn, Heart, Calculator } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header className="navbar glass-panel">
      <div className="container nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-logo">
            <Gem className="brand-icon" />
            <span className="gold-text">LUXEGOLD</span>
          </Link>
        </div>
        
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/style-matcher">Style Matcher</Link>
          <Link to="/calculator">Calculator</Link>
        </nav>
        
        <div className="nav-actions">
          <Link to="/wishlist" className="cart-btn" aria-label="Wishlist" id="nav-wishlist-btn">
            <Heart size={20} />
            {wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
          </Link>
          <Link to="/cart" className="cart-btn" aria-label="Cart" id="nav-cart-btn">
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <Link to="/profile" className="user-btn" aria-label="Profile" id="nav-profile-btn">
              <div className="nav-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link to="/login" className="login-link" id="nav-login-btn">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
          <button className="menu-btn d-mobile" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
