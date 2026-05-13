import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      addToast('Your message has been sent successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="contact-page animate-fade-in">
      <div className="container">
        <div className="contact-header">
          <h1>Get in <span className="gold-text">Touch</span></h1>
          <p>Experience unparalleled service and explore our exquisite collections. Whether you have a question about a bespoke piece or need assistance with an order, our concierges are ready to assist you.</p>
        </div>

        <div className="contact-layout">
          {/* Store Information */}
          <div className="contact-info-card glass-panel">
            <h2>Boutique Information</h2>
            
            <div className="info-item">
              <div className="info-icon"><MapPin size={24} /></div>
              <div className="info-details">
                <h3>Our Flagship</h3>
                <p>740 Fifth Avenue<br />New York, NY 10019<br />United States</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><Phone size={24} /></div>
              <div className="info-details">
                <h3>Phone</h3>
                <p>+1 (800) LUXE-GLD<br />+1 (212) 555-0198</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><Mail size={24} /></div>
              <div className="info-details">
                <h3>Email</h3>
                <p>concierge@luxegold.com<br />press@luxegold.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><Clock size={24} /></div>
              <div className="info-details">
                <h3>Opening Hours</h3>
                <p>Monday - Friday: 10am - 7pm<br />Saturday: 11am - 6pm<br />Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-card glass-panel">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Please describe your inquiry..."
                ></textarea>
              </div>

              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
