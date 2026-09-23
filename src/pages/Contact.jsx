import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import PlaceholderImage from '../components/PlaceholderImage';
import './Contact.css';

const INITIAL_FORM = { name: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isFirebaseConfigured) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setForm(INITIAL_FORM);
      setStatus('sent');
    } catch (error) {
      console.error('Failed to submit message:', error);
      setStatus('error');
    }
  }

  return (
    <section className="section contact-page">
      <div className="container contact-grid">
        <div>
          <span className="eyebrow">Contact</span>
          <h1>We would love to hear from you</h1>
          <p>
            Questions about the video lessons, ideas for future topics, or just want to share
            your family's story? Send us a message and we will get back to you.
          </p>

          <ul className="contact-details">
            <li>
              <strong>Phone</strong>
              <a href="tel:123-456-7890">123-456-7890</a>
            </li>
            <li>
              <strong>Email</strong>
              <a href="mailto:info@mysite.com">info@mysite.com</a>
            </li>
            <li>
              <strong>Address</strong>
              <span>500 Terry Francine Street, 6th Floor, San Francisco, CA 94158</span>
            </li>
          </ul>

          <PlaceholderImage icon="community" tone="muted" label="Map placeholder" className="contact-map" />
        </div>

        <form className="card contact-form" onSubmit={handleSubmit}>
          <h2>Send a message</h2>

          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required value={form.message} onChange={handleChange} />

          <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'sent' && (
            <p className="contact-form__status contact-form__status--success">
              Thanks — your message has been sent. We'll be in touch soon.
            </p>
          )}
          {status === 'error' && (
            <p className="contact-form__status contact-form__status--error">
              {isFirebaseConfigured
                ? "Something went wrong sending your message. Please try again, or reach us by phone or email above."
                : 'This form is not connected to Firebase yet — please reach us by phone or email above in the meantime.'}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
