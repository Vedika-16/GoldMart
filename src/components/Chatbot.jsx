import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import './Chatbot.css';

const QUICK_ACTIONS = [
  { label: '💰 Gold Prices', query: 'What are the current gold prices?' },
  { label: '📦 Track Order', query: 'How can I track my order?' },
  { label: '🔄 Return Policy', query: 'What is your return policy?' },
  { label: '💎 Best Sellers', query: 'What are your best selling items?' },
  { label: '🛡️ Purity Guarantee', query: 'Do you offer a purity guarantee?' },
];

const BOT_RESPONSES = {
  greeting: "Welcome to LUXEGOLD! ✨ I'm Aura, your personal gold concierge. How may I assist you today?",
  default: "Thank you for your interest! For detailed assistance, I'd recommend reaching out to our expert team via the Contact page, or I can help with the quick topics below.",
  prices: "Today's indicative gold rates:\n\n🥇 24K — ₹7,250/gram\n🥈 22K — ₹6,645/gram\n🥉 18K — ₹5,438/gram\n\nRates are updated in real-time on our Gold Ticker. Visit the Calculator page for a detailed valuation!",
  track: "To track your order:\n\n1️⃣ Go to your Profile page\n2️⃣ Navigate to 'Order History'\n3️⃣ Click on your order to view live tracking\n\nNeed more help? Contact us at support@luxegold.com",
  returns: "Our return policy is designed for your peace of mind:\n\n✅ 15-day return window\n✅ Full refund on unused items\n✅ Free return shipping\n✅ Exchange available for all products\n\nItems must be in original packaging with certificates.",
  bestsellers: "Our top picks this season:\n\n👑 Royal Heritage Necklace — 22K\n💍 Eternal Promise Ring — 18K\n✨ Celestial Drop Earrings — 22K\n🌙 Moonlight Bangle Set — 22K\n\nBrowse our full Catalog for more!",
  purity: "Every LUXEGOLD piece comes with:\n\n🔬 BIS Hallmark Certification\n📜 Purity Certificate (tested by NABL lab)\n🛡️ Lifetime buyback at full gold value\n💯 100% purity guarantee\n\nWe stake our reputation on authenticity.",
  shipping: "We offer premium shipping:\n\n🚀 Free insured shipping on orders above ₹25,000\n📦 Secure tamper-proof packaging\n🔒 Fully insured transit\n⏱️ Delivery in 3-5 business days\n\nAll deliveries require signature confirmation.",
  payment: "We accept multiple payment methods:\n\n💳 Credit/Debit Cards (Visa, Mastercard, RuPay)\n🏦 Net Banking & UPI\n📱 EMI options available (3-12 months)\n💰 Bank transfer for high-value orders\n\nAll transactions are 256-bit SSL encrypted.",
  care: "Gold care tips from our experts:\n\n✨ Store in soft cloth pouches separately\n🚿 Remove before swimming or showering\n🧴 Avoid contact with perfumes & chemicals\n🧽 Clean with mild soap and warm water\n💎 Professional cleaning recommended yearly",
};

function getResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('price') || lower.includes('rate') || lower.includes('cost'))
    return BOT_RESPONSES.prices;
  if (lower.includes('track') || lower.includes('order') || lower.includes('delivery') || lower.includes('shipping') || lower.includes('ship'))
    return lower.includes('ship') ? BOT_RESPONSES.shipping : BOT_RESPONSES.track;
  if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange'))
    return BOT_RESPONSES.returns;
  if (lower.includes('best') || lower.includes('popular') || lower.includes('recommend') || lower.includes('top'))
    return BOT_RESPONSES.bestsellers;
  if (lower.includes('purity') || lower.includes('hallmark') || lower.includes('genuine') || lower.includes('real') || lower.includes('certif'))
    return BOT_RESPONSES.purity;
  if (lower.includes('pay') || lower.includes('emi') || lower.includes('upi') || lower.includes('card'))
    return BOT_RESPONSES.payment;
  if (lower.includes('care') || lower.includes('clean') || lower.includes('maintain') || lower.includes('store'))
    return BOT_RESPONSES.care;
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey'))
    return BOT_RESPONSES.greeting;
  return BOT_RESPONSES.default;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: BOT_RESPONSES.greeting, sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text: text.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        text: getResponse(text),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {isOpen && (
        <div className={`chatbot-window ${isClosing ? 'closing' : ''}`}>
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <Sparkles size={20} />
            </div>
            <div className="chatbot-header-info">
              <h4>AURA</h4>
              <span>Online now</span>
            </div>
            <button className="chatbot-close" onClick={handleClose} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="chatbot-quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                className="quick-action-btn"
                onClick={() => sendMessage(action.query)}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isTyping}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        className={`chatbot-fab ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        aria-label="Open chat assistant"
        id="chatbot-fab"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
};

export default Chatbot;
