// Fictional, local fixtures for UI development. Never used as an API fallback.
export function mockChat(question, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Request aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      if (/deadline|assignment|database/i.test(question)) {
        resolve({
          answer:
            'Demo example: Database Systems Assignment 2 is due on November 6, 2026. This is fictional course information for testing the interface.',
          grounded: true,
          sources: [
            {
              id: 1,
              title: 'Mock Database Systems syllabus',
              excerpt: 'Assignment 2 deadline: 2026-11-06.',
            },
            {
              id: 2,
              title: 'Mock assignment submission guide',
              excerpt:
                'Submit Assignment 2 through the fictional course portal.',
            },
          ],
        })
      } else {
        resolve({
          answer:
            "Demo example: I couldn't find this information in the available course materials. Try asking about the Database Systems assignment deadline to see a fictional answer with sources.",
          grounded: false,
          sources: [],
        })
      }
    }, 900)
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}
