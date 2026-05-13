import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { products } from '../data/mockData';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="home-page">
      <Hero />
      
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">Featured <span className="gold-text">Collections</span></h2>
          <Link to="/catalog" className="view-all">View All Collection &rarr;</Link>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="style-matcher-teaser container">
        <div className="teaser-content glass-panel">
          <h2>Not sure what to choose?</h2>
          <p>Let our sophisticated Style Matcher find the perfect piece for your next occasion or timeless investment.</p>
          <Link to="/style-matcher" className="btn-primary">Try Style Matcher</Link>
        </div>
      </section>

      <Newsletter />
    </div>
  );
};

export default Home;
