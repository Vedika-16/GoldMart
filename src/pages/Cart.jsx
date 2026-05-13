import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="empty-icon">
              <ShoppingBag size={64} />
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any exquisite pieces yet.</p>
            <Link to="/catalog" className="btn-primary">
              Explore Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping <span className="gold-text">Cart</span></h1>
          <span className="cart-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="cart-item glass-panel animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <div className="item-meta">
                      <span className="meta-tag">{item.karat}</span>
                      <span className="meta-tag">{item.weight}</span>
                      <span className="meta-tag">{item.category}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="item-price">
                      <span className="price-label">Price</span>
                      <span className="price-value">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-tag">Free</span>
              </div>
              <div className="summary-row">
                <span>Insurance</span>
                <span>Included</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="gold-text">${total.toLocaleString()}</span>
              </div>
            </div>

            {user ? (
              <Link to="/checkout" className="btn-checkout" id="checkout-btn">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/login" className="btn-checkout" id="login-to-checkout-btn">
                Sign In to Checkout <ArrowRight size={16} />
              </Link>
            )}

            <button className="btn-clear" onClick={clearCart} id="clear-cart-btn">
              Clear Cart
            </button>

            <Link to="/catalog" className="continue-shopping">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
