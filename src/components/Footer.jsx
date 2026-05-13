import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container footer-content">
        <div className="footer-section">
          <h3 className="gold-text">LUXEGOLD</h3>
          <p className="footer-desc">
            Crafting timeless elegance. Discover our exclusive collection of premium 18k, 22k, and 24k gold jewelry.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">Jewelry Care</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Our Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Sustainability</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LuxeGold. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
