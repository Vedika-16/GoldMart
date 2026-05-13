import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="wishlist-page animate-fade-in">
        <div className="container">
          <div className="wishlist-empty glass-panel">
            <div className="empty-icon">
              <Heart size={48} />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>Curate your dream collection by saving items you love.</p>
            <Link to="/catalog" className="btn-primary">
              Discover Jewelry <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page animate-fade-in">
      <div className="container">
        <div className="wishlist-header">
          <h1>My <span className="gold-text">Wishlist</span></h1>
          <span className="wishlist-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        <div className="wishlist-grid">
          {items.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
