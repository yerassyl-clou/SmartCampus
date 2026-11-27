/**
 * Authored Design Research sample (FINAL-02). Internal UI fixture values.
 * FINAL-04 owns the wire format and accepted fixture IDs.
 */
const course = {
  slug: 'design-research',
  title: {en: 'Design Research', ru: 'Исследования в дизайне', kk: 'Дизайн зерттеулері'},
  syllabus: {
    section: 3,
    originalLanguage: 'en',
    excerpt: 'Research brief — November 30, 2026. Include your research question and two interview prompts.',
  },
  deadlines: [{
    title: {en: 'Research brief', ru: 'План исследования', kk: 'Зерттеу жоспары'},
    date: '2026-11-30',
    sourceSection: 3,
  }],
};

const answer = {
  en: 'The research brief is due November 30. Include your research question and two interview prompts.',
  ru: 'План исследования нужно сдать 30 ноября. Включите исследовательский вопрос и два вопроса для интервью.',
  kk: 'Зерттеу жоспарын 30 қарашада тапсырыңыз. Зерттеу сұрағын және сұхбатқа арналған екі сұрақты қосыңыз.',
};

export const researchBriefPrompt = 'research-brief-due';

export function readSyntheticCourse(slug) {
  return slug === course.slug ? structuredClone(course) : null;
}

export function replaySyntheticAnswer(courseSlug, promptSlug, locale) {
  if (courseSlug !== course.slug || promptSlug !== researchBriefPrompt) return null;
  const language = Object.hasOwn(answer, locale) ? locale : 'en';
  return {
    mode: 'demo_example',
    locale: language,
    text: answer[language],
    source: {...course.syllabus},
  };
}

// FINAL-04 owns the request envelope. This local allowlist supplies only a
// curated slug to a future approved live adapter.
export const demoChatPath = '/api/v2/demo/chat'
export const sampleCourseSlug = course.slug

export function formatDemoDate(date, locale) {
  return new Intl.DateTimeFormat(locale, {dateStyle:'medium',timeZone:'Asia/Almaty'})
    .format(new Date(date+'T12:00:00+05:00'))
}
