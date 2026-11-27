export const limits = { courses: 10, documents: 5, fileBytes: 10_000_000, chunkBytes: 6 * 1024 * 1024 }
export const sampleId = 'academic-writing'
export const sampleDocument = 'sample-syllabus'
const key = owner => 'sc-v2-fixture-workspace:' + owner

export function almatyDay(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Almaty', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).map(({type, value}) => [type, value]))
  return [parts.year, parts.month, parts.day].join('-')
}

export function deadlineStatus(deadline, today) {
  if (deadline.completed) return 'completed'
  if (deadline.due_on === today) return 'today'
  return deadline.due_on < today ? 'overdue' : 'upcoming'
}

export function readWorkspace(owner) {
  const previous = sessionStorage.getItem(key(owner))
  if (previous) return JSON.parse(previous)
  return {
    courses: [{ id: sampleId, name: 'Academic Writing' }],
    documents: [{ id: sampleDocument, course_id: sampleId, name: 'Synthetic syllabus.pdf', status: 'ready',
      excerpt: 'Submit the research outline on December 4, 2026. The peer review takes place in Week 8.' }],
    deadlines: [],
    candidates: [
      { id: 'outline', course_id: sampleId, document_id: sampleDocument, title: 'Research outline', due_on: '2026-12-04' },
      { id: 'peer-review', course_id: sampleId, document_id: sampleDocument, title: 'Peer review', relative: 'Week 8' },
    ],
  }
}

export function saveWorkspace(owner, workspace) {
  sessionStorage.setItem(key(owner), JSON.stringify(workspace))
}

export function deleteFixtureCourse(workspace, id) {
  return {
    courses: workspace.courses.filter(row => row.id !== id),
    documents: workspace.documents.filter(row => row.course_id !== id),
    deadlines: workspace.deadlines.filter(row => row.course_id !== id),
    candidates: workspace.candidates.filter(row => row.course_id !== id),
  }
}

export function deleteFixtureDocument(workspace, id) {
  return {...workspace, documents: workspace.documents.filter(row => row.id !== id),
    candidates: workspace.candidates.filter(row => row.document_id !== id)}
}
