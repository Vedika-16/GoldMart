import { useState, useRef } from 'react';
import { getRecommendations, products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { UploadCloud, Sparkles, Wand2 } from 'lucide-react';
import './StyleMatcher.css';

const StyleMatcher = () => {
  const [mode, setMode] = useState(null); // 'quiz' or 'visual'
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({ occasion: '', style: '', budget: '' });
  const [results, setResults] = useState([]);
  
  // Visual Search State
  const [isScanning, setIsScanning] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  // --- Quiz Logic ---
  const handleSelect = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (step < 3) {
      setStep(step + 1);
    } else {
      generateQuizResults(value);
    }
  };

  const handleBudgetSelect = (value) => {
    setPreferences(prev => ({ ...prev, budget: value }));
    setStep(2);
  };

  const generateQuizResults = (finalStyle) => {
    const recs = getRecommendations(preferences.occasion, finalStyle, preferences.budget);
    setTimeout(() => {
      setResults(recs);
      setStep(4);
    }, 600);
  };

  // --- Visual Search Logic ---
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setIsScanning(true);
      
      // Simulate Backend AI scanning delay
      setTimeout(() => {
        setIsScanning(false);
        // Randomly pick 3 products as a "visual match" for the mock
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setResults(shuffled.slice(0, 3));
        setStep(4); // Move to results
      }, 3000);
    }
  };

  // --- Rendering ---
  const resetMatcher = () => {
    setMode(null);
    setStep(1);
    setPreferences({ occasion: '', style: '', budget: '' });
    setResults([]);
    setUploadedImage(null);
    setIsScanning(false);
  };

  if (mode === null) {
    return (
      <div className="style-matcher-page container">
         <div className="matcher-header">
          <h1 className="catalog-title">Find Your <span className="gold-text">Match</span></h1>
          <p className="results-subtitle">Choose how you'd like us to recommend your perfect piece.</p>
        </div>
        <div className="mode-selection-grid glass-panel">
          <div className="mode-card" onClick={() => { setMode('quiz'); setStep(1); }}>
            <Wand2 size={48} className="gold-text m-auto mb-4" />
            <h2>Interactive Quiz</h2>
            <p>Answer three simple questions about your budget, occasion, and style.</p>
          </div>
          <div className="mode-card" onClick={() => { setMode('visual'); setStep(1); }}>
            <Sparkles size={48} className="gold-text m-auto mb-4" />
            <h2>Visual Search</h2>
            <p>Upload a photo of an outfit or jewelry, and our AI will find matching pieces.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderQuizContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="matcher-step animate-fade-in">
            <h2>What is your budget range?</h2>
            <div className="options-grid">
              <button className="option-card" onClick={() => handleBudgetSelect('low')}>Under $1,500</button>
              <button className="option-card" onClick={() => handleBudgetSelect('medium')}>$1,500 - $4,000</button>
              <button className="option-card" onClick={() => handleBudgetSelect('high')}>Over $4,000</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="matcher-step animate-fade-in">
            <h2>What is the primary occasion?</h2>
            <div className="options-grid">
              <button className="option-card" onClick={() => handleSelect('occasion', 'wedding')}>Wedding / Engagement</button>
              <button className="option-card" onClick={() => handleSelect('occasion', 'daily')}>Daily Wear</button>
              <button className="option-card" onClick={() => handleSelect('occasion', 'gift')}>Special Gift</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="matcher-step animate-fade-in">
            <h2>Which style do you prefer?</h2>
            <div className="options-grid">
              <button className="option-card" onClick={() => handleSelect('style', 'classic')}>Classic & Timeless</button>
              <button className="option-card" onClick={() => handleSelect('style', 'modern')}>Modern & Minimal</button>
              <button className="option-card" onClick={() => handleSelect('style', 'elegant')}>Elegant & Extravagant</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderVisualContent = () => {
    if (isScanning) {
      return (
        <div className="scanning-container animate-fade-in">
          <div className="scan-image-wrapper">
             <img src={uploadedImage} alt="Scanning" className="scanned-image" />
             <div className="scan-line"></div>
          </div>
          <h2 className="animate-pulse mt-4">AI is analyzing your image...</h2>
          <p className="gold-text">Finding matching geometric traits and color palettes.</p>
        </div>
      );
    }

    return (
      <div className="matcher-step animate-fade-in">
        <h2>Upload an Inspiration Photo</h2>
        <p className="results-subtitle" style={{marginBottom: '2rem'}}>Upload an outfit, a texture, or a piece of jewelry you love.</p>
        
        <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud size={64} className="gold-text mb-4" />
          <h3>Drag & Drop or Click to Upload</h3>
          <p>JPEG, PNG, WEBP supported.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{display: 'none'}} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="style-matcher-page container">
      <div className="matcher-header">
        <h1 className="catalog-title">{mode === 'quiz' ? 'Style ' : 'Visual '} <span className="gold-text">Matcher</span></h1>
        
        {mode === 'quiz' && step < 4 && (
          <div className="progress-bar">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
          </div>
        )}
      </div>

      <div className="matcher-container glass-panel">
        {step === 4 ? (
           <div className="matcher-results animate-fade-in">
             <h2>Your Perfect Matches</h2>
             <p className="results-subtitle">Based on your {mode === 'quiz' ? 'preferences' : 'inspiration image'}, we curated these pieces.</p>
             
             <div className="product-grid">
               {results.map(product => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>
             
             <button className="btn-outline reset-btn" onClick={resetMatcher}>Start Over</button>
           </div>
        ) : (
          mode === 'quiz' ? renderQuizContent() : renderVisualContent()
        )}
      </div>
    </div>
  );
};

export default StyleMatcher;
