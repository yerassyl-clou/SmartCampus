// Vite replaces these constants at build time. Demo mode is never active in production.
export const isMockChat =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_CHAT === 'true'

function readChatResponse(data) {
  if (
    !data ||
    typeof data.answer !== 'string' ||
    !data.answer.trim() ||
    typeof data.grounded !== 'boolean' ||
    (data.sources !== undefined && !Array.isArray(data.sources))
  ) {
    throw new Error(
      'The server returned an unexpected response. Please try again.'
    )
  }

  const sources = (data.sources ?? []).flatMap((source) => {
    if (!source || typeof source !== 'object') return []
    const title = typeof source.title === 'string' ? source.title.trim() : ''
    const excerpt =
      typeof source.excerpt === 'string' ? source.excerpt.trim() : ''
    // Preserve any usable details without inventing missing titles or links.
    return title || excerpt ? [{ title, excerpt }] : []
  })
  return { answer: data.answer, grounded: data.grounded, sources }
}

const serviceErrors = {
  configuration: 'The AI service is not configured. Please contact the project team.',
  authentication: 'The AI service could not authenticate. Please contact the project team.',
  rejection: 'The AI service rejected the request. Please contact the project team.',
  rate_limit: 'The AI service is busy. Please try again later.',
  timeout: 'The AI service took too long. Please try again.',
  invalid_output: 'The AI service returned an invalid answer. Please try again.',
  database_unavailable: 'Course data is unavailable. Please ask the project team to seed the database.',
}

const statusMessages = {
  422: 'Your question could not be accepted. Please check it and try again.',
  503: 'The AI service is temporarily unavailable. Please try again shortly.',
  501: 'Chat is not available on the backend yet. Please try again after the chat service is connected.',
}

export async function requestChat(question, { courseId, signal } = {}) {
  if (isMockChat) {
    const { mockChat } = await import('./mockChat.js')
    return readChatResponse(await mockChat(question, { signal }))
  }

  let response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        ...(courseId != null ? { course_id: courseId } : {}),
      }),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error(
      'The backend could not be reached. Check your connection and try again.'
    )
  }
  if (!response.ok) {
    throw new Error(
      (response.status === 503 && serviceErrors[response.headers.get('X-SmartCampus-Error')]) ||
      statusMessages[response.status] ||
        'Something went wrong while sending your question. Please try again.'
    )
  }

  let data
  try {
    data = await response.json()
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error(
      'The server returned an unreadable response. Please try again.'
    )
  }
  return readChatResponse(data)
}
