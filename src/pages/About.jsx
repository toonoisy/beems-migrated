import { Link } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';
import './About.css';

const VALUES = [
  {
    title: 'Culturally grounded',
    body: 'Our resources are shaped by the real experiences of Indian families who have made Australia home.',
  },
  {
    title: 'Bilingual by design',
    body: 'Every lesson is available in both English and Hindi, so language is never a barrier to support.',
  },
  {
    title: 'Judgement-free',
    body: 'Parenting across cultures is hard. We focus on practical, compassionate guidance, not criticism.',
  },
];

export default function About() {
  return (
    <>
      <section className="section about-hero">
        <div className="container about-hero__grid">
          <div>
            <span className="eyebrow">About Us</span>
            <h1>Supporting families through the immigrant parenting journey</h1>
            <p>
              C-BEEMS (Community BEEMS) exists to help Indian immigrant parents in Australia
              care for their children with confidence. Moving countries reshapes almost every
              part of family life — language, school, extended family, and everyday routines.
              We bring together bilingual video lessons and practical resources so parents
              don't have to navigate that change alone.
            </p>
          </div>
          <PlaceholderImage icon="community" tone="primary" label="Community illustration" className="about-hero__image" />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container about-mission">
          <div className="card about-mission__card">
            <span className="eyebrow">Our mission</span>
            <h2>Helping Indian immigrants care for their children</h2>
            <p>
              We offer videos and resources with practical tips and community connections to
              support parents in their parenting journey. Together, we explore the joys and
              hurdles of raising children in a diverse environment — from adjusting to a new
              culture, to protecting children's mental health and well-being.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">What guides us</span>
            <h2>Our approach</h2>
          </div>
          <div className="grid values-grid">
            {VALUES.map((value) => (
              <div className="card values-grid__card" key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--brand cta">
        <div className="container cta__inner">
          <div>
            <h2>Ready to start watching?</h2>
            <p>Explore our eight bilingual video lessons at your own pace.</p>
          </div>
          <Link to="/videos" className="btn btn--primary">Browse the videos</Link>
        </div>
      </section>
    </>
  );
}
