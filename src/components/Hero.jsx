import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="container hero-content animate-fade-in">
        <h1 className="hero-title">
          Discover the Art of <br />
          <span className="gold-text">Timeless Elegance</span>
        </h1>
        <p className="hero-subtitle">
          Unveil our exclusive collection of premium 18k, 22k, and 24k gold jewelry crafted for your most precious moments.
        </p>
        <div className="hero-actions">
          <Link to="/catalog" className="btn-primary">Shop Collection</Link>
          <Link to="/style-matcher" className="btn-outline">Find Your Match</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
