const invalidData = 'The server returned unexpected deadline data. Please try again.'

function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return year > 0 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]
}

const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
})

export function formatDeadlineDate(isoDate) {
  // These are calendar dates, not local instants. Always format in UTC.
  return dateFormat.format(new Date(`${isoDate}T00:00:00Z`))
}

export async function requestDeadlines({ signal } = {}) {
  let response
  try {
    response = await fetch('/api/deadlines', { signal, cache: 'no-store' })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('The deadline service could not be reached. Check your connection and try again.')
  }
  if (!response.ok) {
    throw new Error('The deadline service is temporarily unavailable. Please try again.')
  }
  let data
  try {
    data = await response.json()
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('The server returned unreadable deadline data. Please try again.')
  }
  if (!data || !Array.isArray(data.items) || !Number.isSafeInteger(data.total) || data.total !== data.items.length) {
    throw new Error(invalidData)
  }
  const ids = new Set()
  const items = data.items.map((item) => {
    if (!item || !Number.isSafeInteger(item.id) || item.id <= 0 || ids.has(item.id) ||
        !Number.isSafeInteger(item.course_id) || item.course_id <= 0 ||
        !isCalendarDate(item.due_date) ||
        !['course_name', 'title', 'source_title'].every((key) => typeof item[key] === 'string' && item[key].trim())) {
      throw new Error(invalidData)
    }
    ids.add(item.id)
    return { ...item, course_name: item.course_name.trim(), title: item.title.trim(), source_title: item.source_title.trim() }
  })
  // ISO calendar strings sort chronologically; IDs make same-day order stable.
  return items.sort((a, b) => a.due_date.localeCompare(b.due_date) || a.id - b.id)
}
