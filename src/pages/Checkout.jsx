import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Truck, Shield, Check, ChevronRight } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zip: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/').slice(0, 5);
    }
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    setPayment({ ...payment, [e.target.name]: value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const id = 'LG-' + Date.now().toString().slice(-8);
    setOrderId(id);

    // Save to order history
    const orders = JSON.parse(localStorage.getItem('luxegold_orders') || '[]');
    orders.push({
      id,
      userId: user.id,
      items: [...items],
      total,
      shipping,
      date: new Date().toISOString(),
      status: 'Processing',
    });
    localStorage.setItem('luxegold_orders', JSON.stringify(orders));

    clearCart();
    setOrderPlaced(true);
    addToast('Order placed successfully!', 'success');
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success animate-fade-in">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h1>Order <span className="gold-text">Confirmed!</span></h1>
            <p className="order-id">Order #{orderId}</p>
            <p className="success-message">
              Thank you for your purchase! You will receive a confirmation email shortly.
            </p>
            <div className="success-details glass-panel">
              <div className="detail-row">
                <Truck size={18} />
                <span>Estimated delivery: 5-7 business days</span>
              </div>
              <div className="detail-row">
                <Shield size={18} />
                <span>Fully insured with certificate of authenticity</span>
              </div>
            </div>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => navigate('/profile')}>View Orders</button>
              <button className="btn-outline" onClick={() => navigate('/catalog')}>Continue Shopping</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
            <div className="step-number">{step > 1 ? <Check size={14} /> : '1'}</div>
            <span>Shipping</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
            <div className="step-number">{step > 2 ? <Check size={14} /> : '2'}</div>
            <span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Review</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-area">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="checkout-card glass-panel animate-fade-in">
                <h2><Truck size={20} /> Shipping Information</h2>
                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={shipping.name} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={shipping.email} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={shipping.phone} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea name="address" value={shipping.address} onChange={handleShippingChange} rows={2} required />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" name="city" value={shipping.city} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input type="text" name="state" value={shipping.state} onChange={handleShippingChange} required />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input type="text" name="zip" value={shipping.zip} onChange={handleShippingChange} required />
                  </div>
                </div>
                <button className="btn-next" onClick={() => setStep(2)}>
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-card glass-panel animate-fade-in">
                <h2><CreditCard size={20} /> Payment Details</h2>
                <div className="checkout-form-grid">
                  <div className="form-group full-width">
                    <label>Card Number</label>
                    <input type="text" name="cardNumber" value={payment.cardNumber} onChange={handlePaymentChange} placeholder="1234 5678 9012 3456" required />
                  </div>
                  <div className="form-group full-width">
                    <label>Name on Card</label>
                    <input type="text" name="cardName" value={payment.cardName} onChange={handlePaymentChange} required />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" name="expiry" value={payment.expiry} onChange={handlePaymentChange} placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" name="cvv" value={payment.cvv} onChange={handlePaymentChange} placeholder="•••" required />
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-next" onClick={() => setStep(3)}>Review Order <ChevronRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="checkout-card glass-panel animate-fade-in">
                <h2><Shield size={20} /> Review Order</h2>
                <div className="review-section">
                  <h3>Shipping To</h3>
                  <p>{shipping.name}</p>
                  <p className="muted">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                  <p className="muted">{shipping.phone}</p>
                </div>
                <div className="review-section">
                  <h3>Items ({items.length})</h3>
                  {items.map(item => (
                    <div key={item.id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p>{item.name}</p>
                        <span className="muted">Qty: {item.quantity} × ${item.price.toLocaleString()}</span>
                      </div>
                      <strong>${(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
                <div className="btn-group">
                  <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-place-order" onClick={handlePlaceOrder}>
                    Place Order — ${total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary glass-panel">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span className="free">Free</span></div>
            <div className="summary-row"><span>Insurance</span><span>Included</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row total"><span>Total</span><span className="gold-text">${total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
