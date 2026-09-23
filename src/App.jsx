import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Videos = lazy(() => import('./pages/Videos'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.PrivacyPolicy })));
const AccessibilityStatement = lazy(() =>
  import('./pages/Legal').then((m) => ({ default: m.AccessibilityStatement })),
);
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="section container">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:lessonId" element={<LessonDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/accessibility" element={<AccessibilityStatement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
