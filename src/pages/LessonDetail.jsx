import { Link, useParams, Navigate } from 'react-router-dom';
import { useLessons } from '../hooks/useLessons';
import BilingualVideo from '../components/BilingualVideo';
import './LessonDetail.css';

export default function LessonDetail() {
  const { lessonId } = useParams();
  const { lessons, loading } = useLessons();

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading lesson…</p>
        </div>
      </section>
    );
  }

  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) {
    return <Navigate to="/videos" replace />;
  }

  const lesson = lessons[index];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];

  return (
    <section className="section lesson-detail">
      <div className="container">
        <Link to="/videos" className="lesson-detail__back">← All lessons</Link>

        <span className="eyebrow">Lesson {lesson.order} of {lessons.length}</span>
        <h1>{lesson.title}</h1>
        <p className="lesson-detail__summary">{lesson.summary}</p>

        <div className="lesson-detail__video">
          <BilingualVideo title={lesson.title} videoUrlEn={lesson.videoUrlEn} videoUrlHi={lesson.videoUrlHi} />
        </div>

        <nav className="lesson-detail__nav" aria-label="Lesson navigation">
          {prev ? (
            <Link to={`/videos/${prev.id}`} className="lesson-detail__nav-link">
              <span>← Previous</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : <span />}

          {next ? (
            <Link to={`/videos/${next.id}`} className="lesson-detail__nav-link lesson-detail__nav-link--next">
              <span>Next →</span>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <Link to="/contact" className="lesson-detail__nav-link lesson-detail__nav-link--next">
              <span>Finished all lessons?</span>
              <strong>Get in touch →</strong>
            </Link>
          )}
        </nav>
      </div>
    </section>
  );
}
