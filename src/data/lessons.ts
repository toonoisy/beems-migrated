import type { HomeIntro, Lesson } from '../types';

// Builds a Vimeo player URL. The "h" hash is required because the videos
// are unlisted on Vimeo; the extra params match Vimeo's own embed code.
function vimeo(id: string, hash: string): string {
  return `https://player.vimeo.com/video/${id}?h=${hash}&badge=0&autopause=0&player_id=0&app_id=58479`;
}

export const homeIntro: HomeIntro = {
  introVideosEn: [vimeo('1229371365', '481895abad')],
  introVideosHi: [vimeo('1229371413', '87e3d01280')],
};

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
    videosEn: [vimeo('1229372595', 'aca9b3f49d')],
    videosHi: [vimeo('1229374458', 'a8df95e257')],
  },
  {
    id: 'four-ways-of-acculturation',
    order: 2,
    title: 'Four Ways of Acculturation',
    summary:
      'The four common patterns families use to adjust to a new culture, and the trade-offs of each approach.',
    videosEn: [vimeo('1229372596', '9a368d13d5')],
    videosHi: [vimeo('1229374460', '6c55565506'), vimeo('1229374459', '47c52b63ce')],
  },
  {
    id: 'children-adapt-faster',
    order: 3,
    title: 'Children Adapt Faster',
    summary:
      'Why children often settle into a new culture more quickly than adults, and what that means for family dynamics at home.',
    videosEn: [vimeo('1229372594', 'b27207cd98')],
    videosHi: [vimeo('1229374457', 'b207e23689')],
  },
  {
    id: 'lived-experiences',
    order: 4,
    title: 'Lived Experiences',
    summary:
      'Real stories from Indian immigrant families in Australia about the joys and challenges of raising children far from home.',
    videosEn: [vimeo('1229372634', 'd0983f2751'), vimeo('1229372637', 'b70fce4a88')],
    videosHi: [vimeo('1229374488', '89822ba08c'), vimeo('1229374490', '97ddfabe5e')],
  },
  {
    id: 'protective-parental-factors',
    order: 5,
    title: 'Protective Parental Factors',
    summary:
      'Parenting habits and family strengths that help children build resilience during cultural transitions.',
    videosEn: [vimeo('1229372646', '18153a9311')],
    videosHi: [vimeo('1229374489', '9f498a7f1d')],
  },
  {
    id: 'less-helpful-parenting-approaches',
    order: 6,
    title: 'Less Helpful Parenting Approaches',
    summary:
      'Common parenting responses to cultural stress that can unintentionally make adjustment harder for children.',
    videosEn: [vimeo('1229372660', '40279fd15f')],
    videosHi: [vimeo('1229374491', '8a653d255e')],
  },
  {
    id: 'mental-health-wellbeing-spectrum',
    order: 7,
    title: 'Mental Health Well-Being Spectrum',
    summary:
      'An overview of the well-being spectrum, from thriving to struggling, and how to recognise where your family sits on it.',
    videosEn: [vimeo('1229372665', '82ed54a28a')],
    videosHi: [vimeo('1229374517', 'be5d6dbe34')],
  },
  {
    id: 'immigrant-specific-mental-health-risk-factors',
    order: 8,
    title: 'Immigrant Specific Mental Health Risk Factors',
    summary:
      'Risk factors that are unique to the immigrant experience, and practical ways to reduce their impact on your family.',
    videosEn: [vimeo('1229372667', '6d8a8ff270')],
    videosHi: [vimeo('1229374528', 'fb30c3b526')],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
