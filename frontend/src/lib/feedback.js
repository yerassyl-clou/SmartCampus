export async function requestFeedback(payload, { signal } = {}) {
  let response
  try {
    response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error('The feedback service could not be reached. Please try again.')
  }

  if (response.status === 409) return 'already_submitted'
  if (response.status === 422) {
    throw new Error('Feedback was rejected. Check the issue category and comment, then try again.')
  }
  if (response.status === 503) {
    throw new Error('Feedback storage is temporarily unavailable. Please try again later.')
  }
  if (response.status !== 201) {
    throw new Error('Feedback could not be saved. Please try again.')
  }

  const data = await response.json().catch(() => null)
  if (data?.status !== 'saved' || !Number.isSafeInteger(data.id) || data.id <= 0) {
    throw new Error('The service did not confirm that feedback was saved. Please try again.')
  }
  return 'saved'
}
