import { useState } from 'react';
import { Calculator, Scale } from 'lucide-react';
import './GoldCalculator.css';

const KARAT_PURITY = {
  '24': { label: '24K (99.9%)', factor: 0.999 },
  '22': { label: '22K (91.6%)', factor: 0.916 },
  '18': { label: '18K (75.0%)', factor: 0.750 },
  '14': { label: '14K (58.3%)', factor: 0.583 },
};

const GOLD_RATE_PER_GRAM_24K = 7250; // INR per gram for 24K

const RATE_CARDS = [
  { karat: '24K', rate: '₹7,250', per: 'per gram' },
  { karat: '22K', rate: '₹6,645', per: 'per gram' },
  { karat: '18K', rate: '₹5,438', per: 'per gram' },
  { karat: '14K', rate: '₹4,227', per: 'per gram' },
];

const GoldCalculator = () => {
  const [weight, setWeight] = useState('');
  const [karat, setKarat] = useState('22');
  const [unit, setUnit] = useState('gram');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();

    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) return;

    // Convert to grams if needed
    let weightInGrams = weightNum;
    if (unit === 'tola') weightInGrams = weightNum * 11.664;
    if (unit === 'ounce') weightInGrams = weightNum * 31.1035;

    const purity = KARAT_PURITY[karat];
    const ratePerGram = GOLD_RATE_PER_GRAM_24K * purity.factor;
    const totalValue = weightInGrams * ratePerGram;

    setResult({
      totalValue,
      weightInGrams: weightInGrams.toFixed(2),
      ratePerGram: ratePerGram.toFixed(2),
      purityLabel: purity.label,
      inputWeight: weightNum,
      inputUnit: unit,
    });
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="calculator-page container">
      <div className="page-header animate-fade-in">
        <h1>
          Gold Value <span className="gold-text">Calculator</span>
        </h1>
        <p>
          Estimate the current market value of your gold based on weight, purity, and today's live rates.
        </p>
      </div>

      <div className="calculator-layout">
        {/* Input Panel */}
        <div className="calc-input-panel glass-panel animate-fade-in">
          <form onSubmit={handleCalculate}>
            <div className="calc-form-group">
              <label htmlFor="gold-weight">Weight</label>
              <input
                id="gold-weight"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>

            <div className="calc-form-group">
              <label htmlFor="weight-unit">Unit</label>
              <select
                id="weight-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="gram">Grams (g)</option>
                <option value="tola">Tola</option>
                <option value="ounce">Troy Ounce (oz)</option>
              </select>
            </div>

            <div className="calc-form-group">
              <label htmlFor="gold-karat">Purity (Karat)</label>
              <select
                id="gold-karat"
                value={karat}
                onChange={(e) => setKarat(e.target.value)}
              >
                {Object.entries(KARAT_PURITY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary calc-submit-btn" id="calc-submit">
              <Calculator size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Calculate Value
            </button>
          </form>
        </div>

        {/* Result Panel */}
        <div className="calc-result-panel glass-panel animate-fade-in">
          {result ? (
            <div className="calc-result">
              <p className="result-label">Estimated Value</p>
              <p className="result-value">{formatCurrency(result.totalValue)}</p>

              <div className="result-breakdown">
                <div className="breakdown-row">
                  <span>Weight</span>
                  <span>{result.inputWeight} {result.inputUnit}{result.inputWeight > 1 ? 's' : ''}</span>
                </div>
                <div className="breakdown-row">
                  <span>In Grams</span>
                  <span>{result.weightInGrams} g</span>
                </div>
                <div className="breakdown-row">
                  <span>Purity</span>
                  <span>{result.purityLabel}</span>
                </div>
                <div className="breakdown-row">
                  <span>Rate/gram</span>
                  <span>₹{result.ratePerGram}</span>
                </div>
              </div>

              <p className="result-disclaimer">
                * Rates are indicative and may vary from actual market prices.
              </p>
            </div>
          ) : (
            <div className="calc-placeholder">
              <Scale size={48} strokeWidth={1} />
              <p>Enter your gold details to see the estimated value</p>
            </div>
          )}
        </div>
      </div>

      {/* Rate Cards */}
      <div className="rate-cards">
        {RATE_CARDS.map((card) => (
          <div key={card.karat} className="rate-card glass-panel">
            <h4>{card.karat} Gold</h4>
            <p className="rate-value">{card.rate}</p>
            <p className="rate-per">{card.per}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldCalculator;
