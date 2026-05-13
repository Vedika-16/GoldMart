import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/mockData';
import './Catalog.css';

const Catalog = () => {
  const [filterKarat, setFilterKarat] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    if (filterKarat !== 'all' && p.karat !== filterKarat) return false;
    if (filterCategory !== 'all' && p.category.toLowerCase() !== filterCategory) return false;
    return true;
  });

  return (
    <div className="catalog-page container animate-fade-in">
      <div className="catalog-header">
        <h1 className="catalog-title">The <span className="gold-text">Collection</span></h1>
        
        <div className="filters glass-panel">
          <div className="filter-group">
            <label>Karat:</label>
            <select value={filterKarat} onChange={(e) => setFilterKarat(e.target.value)} className="filter-select">
              <option value="all">All Karats</option>
              <option value="18k">18k Gold</option>
              <option value="22k">22k Gold</option>
              <option value="24k">24k Gold</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
              <option value="all">All Types</option>
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
              <option value="earrings">Earrings</option>
              <option value="coins">Coins & Bars</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <h3>No pieces found matching your criteria.</h3>
          <button onClick={() => {setFilterKarat('all'); setFilterCategory('all');}} className="btn-outline">Clear Filters</button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
