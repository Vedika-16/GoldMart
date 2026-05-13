import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '../data/mockData';
import './SearchBar.css';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.karat.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    ).slice(0, 6);
    setResults(filtered);
  }, [query]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search jewelry, rings, necklaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            id="search-input"
          />
          <button className="search-close" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map(product => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="search-result-item"
                onClick={onClose}
              >
                <img src={product.image} alt={product.name} className="result-image" />
                <div className="result-info">
                  <h4>{product.name}</h4>
                  <div className="result-meta">
                    <span>{product.category}</span>
                    <span>{product.karat}</span>
                    <span className="result-price">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="search-no-results">
            <p>No pieces found for "<strong>{query}</strong>"</p>
            <span>Try searching for "rings", "necklaces", or "24k"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
