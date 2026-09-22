import { Link } from 'react-router-dom';
import PlaceholderImage from './PlaceholderImage';
import './LessonCard.css';

export default function LessonCard({ lesson }) {
  return (
    <Link to={`/videos/${lesson.id}`} className="lesson-card card">
      {lesson.thumbnailUrl ? (
        <img src={lesson.thumbnailUrl} alt="" className="lesson-card__image" />
      ) : (
        <PlaceholderImage icon="video" tone="primary" className="lesson-card__image" label={`Lesson ${lesson.order}`} />
      )}
      <div className="lesson-card__body">
        <span className="lesson-card__number">Lesson {lesson.order}</span>
        <h3>{lesson.title}</h3>
        <p>{lesson.summary}</p>
        <span className="lesson-card__cta">Watch lesson →</span>
      </div>
    </Link>
  );
}
