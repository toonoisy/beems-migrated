import { Link } from 'react-router-dom';
import PlaceholderImage from '../components/PlaceholderImage';
import BilingualVideo from '../components/BilingualVideo';
import { lessons } from '../data/lessons';
import { useHomeIntro } from '../hooks/useHomeIntro';
import './Home.css';

const HIGHLIGHTS = [
  {
    icon: 'video',
    title: 'Bilingual video lessons',
    body: 'Eight short lessons in English and Hindi covering culture, parenting, and mental well-being.',
  },
  {
    icon: 'family',
    title: 'Practical parenting tips',
    body: 'Guidance grounded in the lived experience of Indian families raising children in Australia.',
  },
  {
    icon: 'community',
    title: 'Community connections',
    body: 'Resources that connect parents with each other and with local support services.',
  },
];

export default function Home() {
  const { introVideoUrlEn, introVideoUrlHi } = useHomeIntro();

  return (
    <>
      <section className="section hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">C-BEEMS</span>
            <h1>Helping Indian Immigrants Care For Their Children</h1>
            <p className="hero__lead">
              Immigrating to Australia from India brings many challenges, and BEEMS helps
              parents navigate these challenges while caring for their children. We offer
              videos and resources with practical tips and community connections to support
              you in your parenting journey. Together, we can explore the joys and hurdles of
              raising children in a diverse environment.
            </p>
            <div className="hero__actions">
              <Link to="/videos" className="btn btn--primary">Watch the Videos</Link>
              <Link to="/about" className="btn btn--outline">About Us</Link>
              <Link to="/contact" className="btn btn--outline">Contact</Link>
            </div>
          </div>
          <PlaceholderImage icon="family" tone="accent" label="Family illustration" className="hero__image" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Why C-BEEMS</span>
            <h2>Support built around your family</h2>
          </div>
          <div className="grid highlights">
            {HIGHLIGHTS.map((item) => (
              <div className="card highlight-card" key={item.title}>
                <PlaceholderImage icon={item.icon} tone="primary" className="highlight-card__icon" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container intro-grid">
          <div>
            <span className="eyebrow">Introduction</span>
            <h2>Watch a short introduction</h2>
            <p>
              Watch a short video in Hindi or English to learn more about C-BEEMS, our goals,
              and how this website works.
            </p>
            <Link to="/videos" className="btn btn--primary">See all lessons</Link>
          </div>
          <BilingualVideo
            title="Introduction to C-BEEMS"
            videoUrlEn={introVideoUrlEn}
            videoUrlHi={introVideoUrlHi}
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Video lessons</span>
            <h2>Eight lessons to support your journey</h2>
          </div>
          <div className="topics-list">
            {lessons.map((lesson) => (
              <Link to={`/videos/${lesson.id}`} key={lesson.id} className="topics-list__item">
                <span className="topics-list__number">{String(lesson.order).padStart(2, '0')}</span>
                <span className="topics-list__title">{lesson.title}</span>
                <span className="topics-list__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--brand cta">
        <div className="container cta__inner">
          <div>
            <h2>Have a question, or want to share your story?</h2>
            <p>We would love to hear from you and connect you with the right resources.</p>
          </div>
          <Link to="/contact" className="btn btn--primary">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
