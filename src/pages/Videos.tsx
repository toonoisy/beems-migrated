import { useLessons } from '../hooks/useLessons';
import LessonCard from '../components/LessonCard';
import './Videos.css';

export default function Videos() {
  const { lessons, loading } = useLessons();

  return (
    <section className="section videos-page">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Video lessons</span>
          <h1>Table of Contents</h1>
          <p>
            Eight short lessons, each available in English and Hindi, covering culture,
            parenting, and mental well-being for immigrant families.
          </p>
        </div>

        {loading ? (
          <p className="videos-page__status">Loading lessons…</p>
        ) : (
          <div className="grid videos-grid">
            {lessons.map((lesson) => (
              <LessonCard lesson={lesson} key={lesson.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
