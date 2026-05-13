import { useParams, Link } from 'react-router-dom';
import { products, getRecommendations } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';
import { Check, ShoppingBag, Heart } from 'lucide-react';
import './ProductView.css';

const ProductView = () => {
  const { id } = useParams();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="container" style={{padding: '5rem 0', textAlign: 'center'}}>
        <h2>Product not found</h2>
        <Link to="/catalog" className="btn-primary" style={{marginTop: '2rem'}}>Back to Catalog</Link>
      </div>
    );
  }

  // Get similar items from recommendation engine based on main tags
  const similarItems = getRecommendations(product.tags[0], null, null).filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    setAdding(true);
    addToCart(product);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  const inWishlist = isInWishlist(product.id);
  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!inWishlist) {
      addToast(`${product.name} added to wishlist!`, 'success');
    } else {
      addToast(`${product.name} removed from wishlist`, 'info');
    }
  };

  return (
    <div className="product-view-page container animate-fade-in">
      <div className="product-detail-grid">
        <div className="product-gallery">
          <img src={product.image} alt={product.name} className="main-image" />
        </div>
        
        <div className="product-info-panel">
          <div className="meta-tags">
            <span className="tag karat-tag">{product.karat} Gold</span>
            <span className="tag weight-tag">{product.weight}</span>
          </div>
          
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price.toLocaleString()}</p>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>
          
          <div className="product-actions">
            <button
              className={`btn-primary add-to-cart ${adding ? 'adding' : ''} ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={adding}
              id="add-to-cart-btn"
            >
              {adding ? (
                'Adding...'
              ) : added ? (
                <><Check size={18} /> Added to Cart</>
              ) : (
                <><ShoppingBag size={18} /> Add to Cart</>
              )}
            </button>
            <button 
              className={`btn-outline wishlist-action-btn ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              <Heart size={18} fill={inWishlist ? "currentColor" : "none"} /> 
              {inWishlist ? 'Saved' : 'Wishlist'}
            </button>
          </div>
          
          <div className="product-features glass-panel">
            <div className="feature">
              <strong>Authenticity:</strong> 100% Certified
            </div>
            <div className="feature">
              <strong>Shipping:</strong> Free Secure Delivery
            </div>
            <div className="feature">
              <strong>Returns:</strong> 30-Day Policy
            </div>
          </div>
        </div>
      </div>

      {similarItems.length > 0 && (
        <section className="similar-items section-margin">
          <h2 className="section-title">You Might Also <span className="gold-text">Love</span></h2>
          <div className="product-grid">
            {similarItems.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductView;
