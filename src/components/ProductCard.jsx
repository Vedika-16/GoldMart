import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // prevent triggering the link wrapping the image
    toggleWishlist(product);
    if (!inWishlist) {
      addToast(`${product.name} added to wishlist!`, 'success');
    } else {
      addToast(`${product.name} removed from wishlist`, 'info');
    }
  };

  return (
    <div className="product-card glass-panel">
      <Link to={`/product/${product.id}`} className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-overlay">
          <span className="view-details">View Details</span>
        </div>
        <button 
          className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Toggle wishlist"
        >
          <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </Link>
      
      <div className="product-info">
        <div className="product-meta">
          <span className="product-karat">{product.karat}</span>
          <span className="product-weight">{product.weight}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-price">${product.price.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default ProductCard;
