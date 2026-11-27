import { copy } from './copy.js'

export const locales = ['en', 'ru', 'kk']
export const dictionaries = Object.fromEntries(locales.map((locale, index) => [
  locale,
  Object.fromEntries(Object.entries(copy).map(([key, tuple]) => [key, tuple[index]])),
]))

export function translator(locale) {
  const dictionary = locales.includes(locale) ? dictionaries[locale] : dictionaries.en
  return key => dictionary[key] || dictionaries.en[key] || key
}

export function readPreference(key) {
  try { return window.localStorage.getItem(key) } catch { return null }
}

export function writePreference(key, value) {
  try { window.localStorage.setItem(key, value) } catch { /* Keep current in-memory preference. */ }
}
