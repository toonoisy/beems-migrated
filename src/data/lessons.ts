import type { Lesson } from '../types';

// Static fallback content, mirroring the shape of documents in the
// Firestore "lessons" collection (see scripts/seed.ts). The Videos and
// LessonDetail pages read from Firestore first and fall back to this list
// so the site still looks complete before a Firebase project is connected.
export const lessons: Lesson[] = [
  {
    id: 'enculturation-acculturation',
    order: 1,
    title: 'Enculturation & Acculturation',
    summary:
      'What these two terms mean, and why understanding them is the first step in supporting your family through the move to Australia.',
  },
  {
    id: 'four-ways-of-acculturation',
    order: 2,
    title: 'Four Ways of Acculturation',
    summary:
      'The four common patterns families use to adjust to a new culture, and the trade-offs of each approach.',
  },
  {
    id: 'children-adapt-faster',
    order: 3,
    title: 'Children Adapt Faster',
    summary:
      'Why children often settle into a new culture more quickly than adults, and what that means for family dynamics at home.',
  },
  {
    id: 'lived-experiences',
    order: 4,
    title: 'Lived Experiences',
    summary:
      'Real stories from Indian immigrant families in Australia about the joys and challenges of raising children far from home.',
  },
  {
    id: 'protective-parental-factors',
    order: 5,
    title: 'Protective Parental Factors',
    summary:
      'Parenting habits and family strengths that help children build resilience during cultural transitions.',
  },
  {
    id: 'less-helpful-parenting-approaches',
    order: 6,
    title: 'Less Helpful Parenting Approaches',
    summary:
      'Common parenting responses to cultural stress that can unintentionally make adjustment harder for children.',
  },
  {
    id: 'mental-health-wellbeing-spectrum',
    order: 7,
    title: 'Mental Health Well-Being Spectrum',
    summary:
      'An overview of the well-being spectrum, from thriving to struggling, and how to recognise where your family sits on it.',
  },
  {
    id: 'immigrant-specific-mental-health-risk-factors',
    order: 8,
    title: 'Immigrant Specific Mental Health Risk Factors',
    summary:
      'Risk factors that are unique to the immigrant experience, and practical ways to reduce their impact on your family.',
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
