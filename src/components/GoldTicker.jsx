import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './GoldTicker.css';

const GOLD_RATES = {
  '24k': { base: 6285, unit: '/g' },
  '22k': { base: 5762, unit: '/g' },
  '18k': { base: 4714, unit: '/g' },
};

const GoldTicker = () => {
  const [rates, setRates] = useState(GOLD_RATES);
  const [changes, setChanges] = useState({ '24k': 0.42, '22k': 0.38, '18k': 0.35 });

  useEffect(() => {
    // Simulate live price fluctuation
    const interval = setInterval(() => {
      setRates(prev => {
        const newRates = {};
        const newChanges = {};
        Object.keys(prev).forEach(key => {
          const fluctuation = (Math.random() - 0.48) * 5;
          newRates[key] = {
            ...prev[key],
            base: Math.round((prev[key].base + fluctuation) * 100) / 100
          };
          newChanges[key] = Math.round(fluctuation * 100) / 100;
        });
        setChanges(newChanges);
        return newRates;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gold-ticker">
      <div className="ticker-label">
        <span className="ticker-dot"></span>
        LIVE GOLD
      </div>
      <div className="ticker-rates">
        {Object.entries(rates).map(([karat, data]) => (
          <div key={karat} className="ticker-rate">
            <span className="rate-karat">{karat.toUpperCase()}</span>
            <span className="rate-price">₹{data.base.toLocaleString()}</span>
            <span className={`rate-change ${changes[karat] >= 0 ? 'up' : 'down'}`}>
              {changes[karat] >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(changes[karat]).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldTicker;
