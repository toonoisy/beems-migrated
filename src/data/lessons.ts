import type { HomeIntro, Lesson } from '../types';

// Builds a Vimeo player URL. The "h" hash is required because the videos
// are unlisted on Vimeo; the extra params match Vimeo's own embed code.
function vimeo(id: string, hash: string): string {
  return `https://player.vimeo.com/video/${id}?h=${hash}&badge=0&autopause=0&player_id=0&app_id=58479`;
}

// Poster frame Vimeo generated for a video, sized for the lesson cards.
// The image id comes from Vimeo's oEmbed response (thumbnail_url) for
// https://vimeo.com/<id>/<hash>; it changes if the poster is replaced.
function vimeoPoster(imageId: string): string {
  return `https://i.vimeocdn.com/video/${imageId}-d_640x360`;
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
    thumbnailUrl: vimeoPoster('2204015324-2909e7b2e00fe79ed81ee084e5b8416b55812b6e9aa02ebd3b2c27ea7d8f7bfe'),
    videosEn: [vimeo('1229372595', 'aca9b3f49d')],
    videosHi: [vimeo('1229374458', 'a8df95e257')],
  },
  {
    id: 'four-ways-of-acculturation',
    order: 2,
    title: 'Four Ways of Acculturation',
    summary:
      'The four common patterns families use to adjust to a new culture, and the trade-offs of each approach.',
    thumbnailUrl: vimeoPoster('2204015319-889ede4f383bead75a75d7a1eba4fc58cd93307bab1e7e3adcd5d4ba05d86ad3'),
    videosEn: [vimeo('1229372596', '9a368d13d5')],
    videosHi: [vimeo('1229374460', '6c55565506'), vimeo('1229374459', '47c52b63ce')],
  },
  {
    id: 'children-adapt-faster',
    order: 3,
    title: 'Children Adapt Faster',
    summary:
      'Why children often settle into a new culture more quickly than adults, and what that means for family dynamics at home.',
    thumbnailUrl: vimeoPoster('2204015320-5782462d2e168bb42a0800330baffd8c21c1d58b2e4b04327551ede228f9f387'),
    videosEn: [vimeo('1229372594', 'b27207cd98')],
    videosHi: [vimeo('1229374457', 'b207e23689')],
  },
  {
    id: 'lived-experiences',
    order: 4,
    title: 'Lived Experiences',
    summary:
      'Real stories from Indian immigrant families in Australia about the joys and challenges of raising children far from home.',
    thumbnailUrl: vimeoPoster('2204015381-f33b134b5bf5dafcf56800130c8a96b20e001b454e4d6a750b0bf2b973ddf852'),
    videosEn: [vimeo('1229372634', 'd0983f2751'), vimeo('1229372637', 'b70fce4a88')],
    videosHi: [vimeo('1229374488', '89822ba08c'), vimeo('1229374490', '97ddfabe5e')],
  },
  {
    id: 'protective-parental-factors',
    order: 5,
    title: 'Protective Parental Factors',
    summary:
      'Parenting habits and family strengths that help children build resilience during cultural transitions.',
    thumbnailUrl: vimeoPoster('2204015377-7b4f71ffe46e07f2e92f8b0c388bbd9f0929f5f036d3c6f364e383c5b9f63227'),
    videosEn: [vimeo('1229372646', '18153a9311')],
    videosHi: [vimeo('1229374489', '9f498a7f1d')],
  },
  {
    id: 'less-helpful-parenting-approaches',
    order: 6,
    title: 'Less Helpful Parenting Approaches',
    summary:
      'Common parenting responses to cultural stress that can unintentionally make adjustment harder for children.',
    thumbnailUrl: vimeoPoster('2204015448-2ebfc23c2ca712a8c8218ab702a50aba1b66ba30114dc2e00fb389db08ea7ac9'),
    videosEn: [vimeo('1229372660', '40279fd15f')],
    videosHi: [vimeo('1229374491', '8a653d255e')],
  },
  {
    id: 'mental-health-wellbeing-spectrum',
    order: 7,
    title: 'Mental Health Well-Being Spectrum',
    summary:
      'An overview of the well-being spectrum, from thriving to struggling, and how to recognise where your family sits on it.',
    thumbnailUrl: vimeoPoster('2204015445-7ad1bb1d9a9b475ccf6cfb0525aa2d23c93eba924def7cf36f0d3293e4ecb1a7'),
    videosEn: [vimeo('1229372665', '82ed54a28a')],
    videosHi: [vimeo('1229374517', 'be5d6dbe34')],
  },
  {
    id: 'immigrant-specific-mental-health-risk-factors',
    order: 8,
    title: 'Immigrant Specific Mental Health Risk Factors',
    summary:
      'Risk factors that are unique to the immigrant experience, and practical ways to reduce their impact on your family.',
    thumbnailUrl: vimeoPoster('2204015405-878f22e8ebec729ccc9753d282c26c6c3cce757704a1d14d606ccd33c5f5871c'),
    videosEn: [vimeo('1229372667', '6d8a8ff270')],
    videosHi: [vimeo('1229374528', 'fb30c3b526')],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}
